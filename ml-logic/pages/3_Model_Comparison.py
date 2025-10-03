# # pages/3_Model_Comparison.py

# import streamlit as st

# st.title("3. Model Comparison & Report Generation")

# if "df" not in st.session_state:
#     st.warning("Please upload and process a dataset first.")
# else:
#     st.info("🛠️ This feature is under construction.")
#     st.write("In the future, this page will:")
#     st.markdown("""
#     - Train the recommended algorithm along with two other strong candidates.
#     - Display a comparison of their performance metrics (like Accuracy, F1-Score, R-squared, etc.).
#     - Allow you to generate and download a performance report.
#     """)



# pages/3_Model_Comparison.py

# pages/3_Model_Comparison.py

import streamlit as st
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from docx import Document
from docx.shared import Inches
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter

st.title("3. Model Comparison & Report Generation")

# Check if dataset is available
if "df" not in st.session_state:
    st.warning("Please upload and process a dataset first on the homepage.")
else:
    df = st.session_state.df

    # Dataset Summary
    dataset_summary = {
        "Rows": df.shape[0],
        "Columns": df.shape[1],
        "Missing Values": int(df.isnull().sum().sum())
    }

    st.subheader("📊 Dataset Summary")
    for key, value in dataset_summary.items():
        st.write(f"**{key}:** {value}")

    # Recommended Algorithm
    if "recommendation" in st.session_state:
        rec = st.session_state.recommendation
        st.subheader("🎯 Recommended Algorithm")
        st.markdown(f"**Algorithm:** {rec['algorithm']}")
        st.markdown(f"**Justification:** {rec['simple_explanation']}")

        with st.expander("Show technical details"):
            for reason in rec["reason_parts"]:
                st.write(f"- {reason}")

        # Class Distribution Pie Chart (Optional)
        if df.shape[1] >= 1:
            plt.figure(figsize=(4,4))
            df[df.columns[0]].value_counts().plot.pie(
                autopct='%1.1f%%', colors=sns.color_palette('pastel')
            )
            plt.title("Class Distribution")
            plt.tight_layout()
            plt.savefig("class_distribution.png")
            plt.close()
            st.image("class_distribution.png", caption="Class Distribution")

        # Generate Word Report
        if st.button("📄 Generate Word Report"):
            doc = Document()
            doc.add_heading("AutoML Report", 0)

            doc.add_heading("Dataset Overview", level=1)
            for key, value in dataset_summary.items():
                doc.add_paragraph(f"{key}: {value}")

            doc.add_heading("Algorithm Recommendation", level=1)
            doc.add_paragraph(f"Algorithm: {rec['algorithm']}")
            doc.add_paragraph(f"Justification: {rec['simple_explanation']}")

            if df.shape[1] >= 1:
                doc.add_heading("Graphs", level=1)
                doc.add_picture("class_distribution.png", width=Inches(4))

            doc.save("report.docx")
            st.success("✅ Word report generated: report.docx")

        # Generate PDF Report
        if st.button("📑 Generate PDF Report"):
            c = canvas.Canvas("report.pdf", pagesize=letter)
            c.setFont("Helvetica-Bold", 16)
            c.drawString(100, 750, "AutoML Report")

            c.setFont("Helvetica", 12)
            y = 720
            for key, value in dataset_summary.items():
                c.drawString(100, y, f"{key}: {value}")
                y -= 20

            c.drawString(100, y-10, f"Recommended Algorithm: {rec['algorithm']}")
            c.drawString(100, y-30, f"Justification: {rec['simple_explanation']}")

            if df.shape[1] >= 1:
                c.drawImage("class_distribution.png", 100, y-250, width=200, height=200)
            c.save()
            st.success("✅ PDF report generated: report.pdf")

    else:
        st.info("Please go to '2. Algorithm Recommendation' page to get the recommendation.")
