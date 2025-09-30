# pages/3_Model_Comparison.py

import streamlit as st

st.title("3. Model Comparison & Report Generation")

if "df" not in st.session_state:
    st.warning("Please upload and process a dataset first.")
else:
    st.info("🛠️ This feature is under construction.")
    st.write("In the future, this page will:")
    st.markdown("""
    - Train the recommended algorithm along with two other strong candidates.
    - Display a comparison of their performance metrics (like Accuracy, F1-Score, R-squared, etc.).
    - Allow you to generate and download a performance report.
    """)