# AlgoSelector

AlgoSelector is an end-to-end platform for **tabular data profiling, preprocessing, and automated algorithm recommendation**. It combines a React-based interactive frontend with a FastAPI backend and a Streamlit-powered ML engine for deep insights and SHAP-based explainability.

---

## 🚀 Features

- **Automated Data Profiling**: Quick summaries of data types, missing values, and statistical distributions.
- **Intelligent Preprocessing**: Automated suggestions for missing value imputation, encoding, and scaling.
- **Algorithm Recommendation**: Suggests the best-suited machine learning algorithms based on dataset characteristics.
- **AutoML & Explainability**: Integration with specialized ML logic for training and SHAP analysis.
- **Interactive Dashboard**: Modern UI built with React and Tailwind CSS.

---

## 🛠️ Project Structure

- `backend/`: FastAPI server handling data processing, model orchestration, and storage.
- `frontend/`: React + Vite application for the user interface.
- `ml-logic/`: Streamlit-based engine for specialized ML exploration and profiling.
- `scripts/`: Utility scripts for verification and testing.

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/bhaskar-sisodiya/AlgoSelector.git
cd AlgoSelector
```

### 2. Backend Setup
The backend requires a PostgreSQL database (Supabase recommended).

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a `.env` file from the example:
   ```bash
   cp .env.example .env
   ```
3. Update `.env` with your credentials (database URL, secret keys).
4. Create and activate a virtual environment:
   ```bash
   # Create venv
   python -m venv venv

   # Activate (Windows)
   .\venv\Scripts\activate

   # Activate (macOS/Linux)
   source venv/bin/activate
   ```
5. Install dependencies:
   ```bash
   pip install -r ../requirements.txt
   ```
6. Start the backend:
   ```bash
   uvicorn main:app --reload
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Create a `.env` file:
   ```bash
   cp .env.example .env
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### 4. ML Logic (Streamlit) Setup
Alternatively, you can run the Streamlit-based profiling engine directly:
```bash
# From the root directory
streamlit run ml-logic/Home.py
```

---

## 🔒 Environment Variables

Ensure `.env` files are configured in both `backend/` and `frontend/` directories:

### Backend `.env`
- `DATABASE_URL`: Your PostgreSQL connection string.
- `SECRET_KEY`: A secure key for session/token management.
- `FRONTEND_URL`: The URL where your frontend is running (default: `http://localhost:5173`).

### Frontend `.env`
- `VITE_API_BASE_URL`: The URL of the FastAPI backend (default: `http://127.0.0.1:8000`).

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the [MIT License](LICENSE).