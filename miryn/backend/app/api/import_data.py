import json
from fastapi import APIRouter, Depends, UploadFile, File, BackgroundTasks, HTTPException
from app.core.security import get_current_user_id
from app.workers.import_worker import process_chatgpt_import, process_gemini_import
from app.core.cache import redis_client

router = APIRouter(prefix="/import", tags=["import"])

@router.post("/chatgpt")
async def import_chatgpt(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user_id)
):
    # Check file size (50MB cap)
    content = await file.read()
    if len(content) > 50 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large. Max 50MB.")
    
    if not file.filename.endswith(".json"):
        raise HTTPException(status_code=400, detail="Upload conversations.json from your ChatGPT export.")
    
    background_tasks.add_task(process_chatgpt_import, user_id, content)
    return {"status": "processing", "message": "Import started. Check back in a minute."}

@router.post("/gemini")
async def import_gemini(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user_id)
):
    if file.size > 50 * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large. Max 50MB.")
    
    content = await file.read()
    background_tasks.add_task(process_gemini_import, user_id, content)
    return {"status": "processing", "message": "Gemini import started."}

@router.get("/status")
def get_import_status(user_id: str = Depends(get_current_user_id)):
    # Return status from Redis key: import_status:{user_id}
    status = redis_client.get(f"import_status:{user_id}")
    return json.loads(status) if status else {"status": "none"}
