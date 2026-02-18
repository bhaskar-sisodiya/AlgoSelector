# ml-logic/pages/Algorithm_Recommendation.py

import streamlit as st
from logic.selection.algorithm_recommender import recommend_algorithm

st.title("⚙️ Step 2: Algorithm Recommendation")

# --- Basic Checks ---
if "df" not in st.session_state:
    st.warning("⚠️ Please upload a dataset on the homepage first.")
elif not st.session_state.get('target_column'):
    st.warning("⚠️ Please select a target column on the 'Profiling and Preprocessing' page.")
elif not st.session_state.get('is_preprocessed', False):
    st.warning("⚠️ Please apply preprocessing before proceeding.")
else:
    df = st.session_state.df
    target_col = st.session_state.target_column
    imbalance_ratio = st.session_state.get("imbalance_ratio", 1.0)

    st.success("✅ Dataset is ready! Let's discover the best algorithm for your data...")

    # --- Get Recommendations ---
    results = recommend_algorithm(df, target_col, imbalance_ratio)

    # --- Store for later use ---
    st.session_state.recommendation = results
    st.session_state.algo_summary = {
        "top": results["top_algorithm"],
        "all": [a["name"] for a in results["recommendations"]],
        "explanation": results["simple_explanation"]
    }

    # --- Display Top Recommendation ---
    st.markdown(f"""
    <div style="padding: 14px; border-radius: 10px; background: linear-gradient(135deg, #e8f5e9, #c8e6c9); border-left: 6px solid #4CAF50;">
        <p style="font-size: 22px; font-weight: bold; margin: 0; color: #1B5E20;">🏆 Top Recommended Algorithm</p>
        <p style="font-size: 20px; color: #2E7D32; margin-top: 4px;">{results['top_algorithm']}</p>
    </div>
    """, unsafe_allow_html=True)

    st.markdown("#### 💡 Why this algorithm?")
    st.info(results["simple_explanation"])

    # --- Other Recommendations (only 2 visible) ---
    st.markdown("### 🔍 Other Suggested Algorithms")
    for algo in results["recommendations"][:2]:  # ✅ Only top 2 alternatives
        st.markdown(f"""
        <div style="padding: 16px; margin-bottom: 12px; border-radius: 10px; background: linear-gradient(135deg, #f9f9f9, #ffffff);
                    box-shadow: 0 2px 6px rgba(0,0,0,0.15); border-left: 5px solid #2196F3;">
            <p style="font-size: 18px; font-weight: bold; margin: 0; color: #0D47A1;">🔹 {algo['name']}</p>
            <p style="font-size: 15px; color: #333; margin-top: 6px;">💬 <b>Why use it:</b> {algo['best_for']}</p>
        </div>
        """, unsafe_allow_html=True)

    # --- Technical Explanation ---
    with st.expander("🧠 Technical Details Behind the Choice"):
        st.markdown("These factors were analyzed to select the best algorithm:")
        for reason in results["reason_parts"]:
            st.write(f"- {reason}")

    # --- Friendly Closing ---
    st.success(f"💡 Tip: Start experimenting with **{results['top_algorithm']}**, "
               "then compare it with the alternatives for performance and accuracy.")
