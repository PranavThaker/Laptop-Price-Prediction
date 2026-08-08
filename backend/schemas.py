from pydantic import BaseModel,Field

class LaptopInput(BaseModel):
    Company: str
    TypeName: str
    Ram: int
    Weight: float = Field(...,gt=0,le=10)
    Touchscreen: int
    Ips: int

    Inches: float = Field(...,gt=0,le=25)
    X_res: int
    Y_res: int

    Cpu: str
    HDD: int
    SSD: int
    Gpu: str
    OpSys: str