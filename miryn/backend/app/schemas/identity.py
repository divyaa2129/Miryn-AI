from typing import Optional, Dict, Any, List
from pydantic import BaseModel


class IdentityOut(BaseModel):
    id: str
    user_id: str
    version: int
    state: str
    traits: Dict[str, Any] = {}
    values: Dict[str, Any] = {}
    beliefs: List[Dict[str, Any]] = []
    open_loops: List[Dict[str, Any]] = []


class IdentityUpdate(BaseModel):
    traits: Optional[Dict[str, Any]] = None
    values: Optional[Dict[str, Any]] = None
    beliefs: Optional[List[Dict[str, Any]]] = None
    open_loops: Optional[List[Dict[str, Any]]] = None
    state: Optional[str] = None
