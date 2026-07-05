import os
import sys

# Ensure the backend directory is in the Python search path
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.dirname(current_dir)
if backend_dir not in sys.path:
    sys.path.append(backend_dir)
if current_dir not in sys.path:
    sys.path.append(current_dir)

from main import app
