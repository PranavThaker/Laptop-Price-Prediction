from pydantic import BaseModel

class LaptopInput(BaseModel):
    Company: str
    TypeName: str
    Ram: int
    Weight: float
    Touchscreen: int
    Ips: int

    Inches: float
    X_res: int
    Y_res: int

    Cpu: str
    HDD: int
    SSD: int
    Gpu: str
    OpSys: str