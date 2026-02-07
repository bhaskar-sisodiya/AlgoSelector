# pages/1_Profiling_and_Preprocessing.py

import streamlit as st
from utils.profiling.profile_summary import get_column_info, get_categorical_summary
from logic.selection.imbalance_checker import check_class_imbalance
from logic.preprocessing.missing_handler import handle_missing
from logic.preprocessing.feature_transformer import encode_and_scale
from logic.suggestions.suggest_steps import generate_suggestions

st.title("1. Data Profiling & Preprocessing Advisory")

if "df" not in st.session_state:
    st.warning("Please upload a dataset on the homepage first.")
else:
    df = st.session_state.df

    st.subheader("🔍 Preview of Dataset")
    st.dataframe(df.head())

    # Detect categorical columns
    st.session_state.categorical_cols_initial = df.select_dtypes(include=['object', 'category']).columns.tolist()

    st.subheader("📑 Column Information")
    st.dataframe(get_column_info(df))

    st.subheader("📊 Descriptive Statistics (Numeric Columns)")
    st.dataframe(df.describe().T)

    st.subheader("🎯 Select Target Column")
    current_cols = df.columns.tolist()
    try:
        default_index = current_cols.index(st.session_state.get("target_column", current_cols[0]))
    except ValueError:
        default_index = 0
    st.session_state.target_column = st.selectbox("Choose the target column:", current_cols, index=default_index)

    st.subheader("💡 Preprocessing Suggestions")
    if st.session_state.target_column:
        if df[st.session_state.target_column].dtype in ['object', 'category', 'int64']:
            st.session_state.imbalance_ratio = check_class_imbalance(df, st.session_state.target_column)
        else:
            st.session_state.imbalance_ratio = 1

        suggestions = generate_suggestions(
            df,
            st.session_state.categorical_cols_initial,
            st.session_state.imbalance_ratio,
            st.session_state.target_column
        )

        if suggestions:
            for s in suggestions:
                st.write(f"- {s}")
        else:
            st.success("✅ No further preprocessing suggestions. Dataset looks clean!")

    st.subheader("🧹 Apply Preprocessing")
    preprocess_option = st.selectbox(
        "Choose a method for missing values (this will also apply encoding and scaling):",
        ["None", "Drop Missing Rows", "Fill with Mean (Numeric Only)", "Fill with Mode (Categorical Only)"]
    )

    if st.button("Apply Preprocessing"):
        if not st.session_state.target_column:
            st.error("⚠️ Please select a target column first.")
        elif preprocess_option != "None":
            processed_df = handle_missing(df.copy(), preprocess_option, st.session_state.categorical_cols_initial)
            processed_df = encode_and_scale(processed_df, st.session_state.categorical_cols_initial, st.session_state.target_column)

            # Store updates
            st.session_state.df = processed_df
            st.session_state.is_preprocessed = True
            st.session_state.preprocessing_summary = {
                "Missing Value Strategy": preprocess_option,
                "Categorical Columns Encoded": st.session_state.categorical_cols_initial,
                "Scaling Applied": True,
                "Rows (Before → After)": f"{len(df)} → {len(processed_df)}"
            }

            st.success("✅ Preprocessing applied successfully!")
            st.subheader("🔍 Preview After Preprocessing")
            st.dataframe(processed_df.head())

        else:
            st.warning("Please select a preprocessing method.")
