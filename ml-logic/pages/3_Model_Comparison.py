import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from docx import Document
from docx.shared import Inches
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet
import os
from utils.report_generator import generate_stylish_word_report, generate_stylish_pdf_report
st.title("3. Model Comparison & Report Generation")

# Check if dataset is available
if "df" not in st.session_state:
    st.warning("Please upload and process a dataset first on the homepage.")
else:
    df = st.session_state.df
    target_col = st.session_state.get("target_column", None)

    # Dataset Summary
    dataset_summary = {
        "Rows": df.shape[0],
        "Columns": df.shape[1],
        "Missing Values": int(df.isnull().sum().sum())
    }

    st.subheader("📊 Dataset Summary")
    for key, value in dataset_summary.items():
        st.write(f"**{key}:** {value}")

    # Column Information
    col_info = pd.DataFrame({
        "Column Name": df.columns,
        "Data Type": df.dtypes.astype(str),
        "Unique Values": [df[col].nunique() for col in df.columns]
    })

    st.subheader("📑 Column Details")
    st.dataframe(col_info)

    # Preprocessing Summary (from page 1)
    preprocessing_summary = st.session_state.get("preprocessing_summary", None)
    if preprocessing_summary:
        st.subheader("🧹 Preprocessing Summary")
        for key, value in preprocessing_summary.items():
            st.write(f"**{key}:** {value}")
    else:
        st.info("No preprocessing summary found. (It will appear once preprocessing is done.)")

    # Recommended Algorithm Section
    if "recommendation" in st.session_state:
        rec_data = st.session_state.recommendation

        st.subheader("🎯 Recommended Algorithm")

        # Safely access algorithm info
        top_algo = rec_data.get("top_algorithm", "N/A")
        st.markdown(f"**Top Algorithm:** {top_algo}")

        simple_exp = rec_data.get("simple_explanation", "Explanation not available.")
        st.info(simple_exp)

        # Detailed Reason
        if "reason_parts" in rec_data:
            with st.expander("Show technical details"):
                for reason in rec_data["reason_parts"]:
                    st.write(f"- {reason}")

        # Alternative Recommendations
        recommendations = rec_data.get("recommendations", [])
        if recommendations:
            st.subheader("🔍 Other Suggested Algorithms")
            for rec in recommendations:
                name = rec.get("name", "Unknown Algorithm")
                best_for = rec.get("best_for", "Not specified")

                st.markdown(f"""
                <div style="
                    padding: 18px; 
                    margin-bottom: 14px; 
                    border-radius: 12px; 
                    background: linear-gradient(135deg, #1e1e1e, #2d2d2d);
                    box-shadow: 0 2px 6px rgba(0,0,0,0.4); 
                    border: 1px solid #333;
                ">
                    <p style="font-size: 20px; font-weight: 700; margin: 0; 
                              background: linear-gradient(90deg, #00c6ff, #0072ff); 
                              -webkit-background-clip: text; 
                              -webkit-text-fill-color: transparent;">
                        {name}
                    </p>
                    <p style="font-size: 15px; color: #ddd; margin-top: 6px; line-height: 1.5;">
                        {best_for}
                    </p>
                </div>
                """, unsafe_allow_html=True)


        # Class Distribution Pie Chart
        class_plot_path = None
        if target_col and df[target_col].dtype in ['object', 'category', 'bool', 'int64'] and df[target_col].nunique() < 20:
            class_plot_path = "class_distribution.png"
            plt.figure(figsize=(4, 4))
            df[target_col].value_counts().plot.pie(
                autopct='%1.1f%%', colors=sns.color_palette('pastel')
            )
            plt.title(f"Class Distribution: {target_col}")
            plt.tight_layout()
            plt.savefig(class_plot_path)
            plt.close()
            st.image(class_plot_path, caption="Class Distribution")

        # ==========================
        # 📄 Generate Word Report
        # ==========================
        

# 📄 Generate Word Report
if st.button("📄 Generate Word Report"):
    word_file = generate_stylish_word_report(
        dataset_summary, col_info, preprocessing_summary, top_algo, simple_exp, recommendations, class_plot_path
    )
    st.success(f"✅ Stylish Word report generated: {word_file}")

    with open(word_file, "rb") as f:
        st.download_button(
            label="⬇️ Download Word Report",
            data=f,
            file_name=word_file,
            mime="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        )

# 📑 Generate PDF Report
if st.button("📑 Generate PDF Report"):
    pdf_file = generate_stylish_pdf_report(
        dataset_summary, col_info, preprocessing_summary, top_algo, simple_exp, recommendations, class_plot_path
    )
    st.success(f"✅ Stylish PDF report generated: {pdf_file}")

    with open(pdf_file, "rb") as f:
        st.download_button(
            label="⬇️ Download PDF Report",
            data=f,
            file_name=pdf_file,
            mime="application/pdf"
        )
