Setup
-----

1. Create & activate the virtual environment, install deps:

```bash
python3 -m venv .venv
. .venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

2. Run the app:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Or run the helper script:

```bash
bash run.sh
```

Open http://127.0.0.1:8000/ to see the JSON response.
