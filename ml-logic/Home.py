# ml-logic/Home.py

import streamlit as st
from utils.file_ops.csv_loader import load_csv
from logic.suggestions.target_suggester import suggest_target_column

st.set_page_config(
    page_title="AutoML Assistant",
    layout="wide"
)

st.title("📊 Welcome to the AutoML Assistant!")

# --- File Uploader ---
uploaded_file = st.file_uploader("Upload your CSV file", type=["csv"])

# --- Smarter Session State Management (Corrected) ---

# Create a unique ID from file name and size, which are always available
current_file_id = None
if uploaded_file is not None:
    current_file_id = f"{uploaded_file.name}-{uploaded_file.size}"

stored_file_id = st.session_state.get('file_id', None)

# If the uploader is empty OR a new file is uploaded, reset the state
if not current_file_id or current_file_id != stored_file_id:
    keys_to_clear = [
        'df', 'categorical_cols_initial', 'imbalance_ratio', 
        'target_column', 'is_preprocessed', 'initial_load', 'file_id'
    ]
    for key in keys_to_clear:
        if key in st.session_state:
            del st.session_state[key]

# Load and initialize the state only once per file
if uploaded_file and "df" not in st.session_state:
    # Use our newly created unique ID
    st.session_state.file_id = f"{uploaded_file.name}-{uploaded_file.size}"
    
    st.session_state.df = load_csv(uploaded_file)
    st.session_state.categorical_cols_initial = st.session_state.df.select_dtypes(include=['object', 'category']).columns.tolist()
    st.session_state.imbalance_ratio = None
    st.session_state.is_preprocessed = False
    
    suggested_target = suggest_target_column(st.session_state.df)
    st.session_state.target_column = suggested_target
    st.session_state.initial_load = True
    st.success("✅ File uploaded successfully! Select a page from the sidebar to continue.")

# --- Welcome / Status Message ---
if "df" in st.session_state:
    st.info("A dataset is loaded. You can now explore the pages in the sidebar.")
else:
    st.info("Upload a dataset to begin. Once uploaded, navigate pages using the sidebar.")