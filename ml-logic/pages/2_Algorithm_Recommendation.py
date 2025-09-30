# pages/2_Algorithm_Recommendation.py

import streamlit as st
from logic.selection.algorithm_recommender import recommend_algorithm

st.title("2. Algorithm Recommendation")

if "df" not in st.session_state:
    st.warning("Please upload a dataset on the homepage first.")
elif not st.session_state.get('target_column'):
    st.warning("Please select a target column on the 'Profiling and Preprocessing' page.")
elif not st.session_state.get('is_preprocessed', False):
    st.warning("Your dataset has pending suggestions. Please apply preprocessing on the first page or upload a clean dataset.")
else:
    df = st.session_state.df
    st.success("Your dataset is ready! Here is our recommendation:")

    recommendation = recommend_algorithm(df, st.session_state.target_column, st.session_state.imbalance_ratio)
    
    st.markdown(f"""
    <div style="padding: 10px; border-radius: 5px; background-color: #f0f2f6;">
        <p style="font-size: 24px; font-weight: bold; margin: 0; color: #333333;">Recommended Algorithm</p>
        <p style="font-size: 20px; color: #008000; margin: 0;">{recommendation["algorithm"]}</p>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("#### Why this algorithm?")
    st.info(recommendation["simple_explanation"])

    with st.expander("Show technical details"):
        for reason in recommendation["reason_parts"]:
            st.write(f"- {reason}")