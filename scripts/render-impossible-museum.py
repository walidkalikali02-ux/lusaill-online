"""Render the Lusaill Impossible Museum hero asset (architectural concept demo).
Output is deterministic and contains no third-party assets.
"""
from pathlib import Path
import math
import cv2
import numpy as np

W, H, FPS, SECONDS = 960, 540, 20, 15
OUTPUT = Path("public/museum")
OUTPUT.mkdir(parents=True, exist_ok=True)

YY, XX = np.ogrid[:H, :W]
R = np.sqrt(((XX-W*.57)/(W*.66))**2 + ((YY-H*.43)/(H*.95))**2)
BASE = np.zeros((H, W, 3), np.uint8)
for k, (v, lift) in enumerate([(7, 23), (9, 22), (12, 20)]):
    BASE[:, :, k] = np.clip(v + (1-np.minimum(R, 1))*lift, 0, 255)
VIGNETTE = np.clip((R-.22)*1.05, 0, .65).astype(np.float32)

class Museum:
    def __init__(self, t):
        self.t = t
        self.room = int((t % SECONDS) // 3)
        self.phase = t % 3 / 3
        self.z = 1.6 + (t % 3)*6.35
        self.x = math.sin(t*.29)*.13
        self.y = 1.25 + math.sin(t*.19)*.10
        self.yaw = -.065 + math.sin(t*.15)*.016
        self.frame = BASE.copy()
        self.glow = np.zeros_like(self.frame)

    def project(self, p):
        x, y, z = p
        dx, dy, dz = x-self.x, y-self.y, z-self.z
        c, s = math.cos(self.yaw), math.sin(self.yaw)
        xx, zz = dx*c-dz*s, dx*s+dz*c
        if zz < .1:
            return None
        focal = H*.98
        return int(W*.585 + focal*xx/zz), int(H*.49-focal*dy/zz)

    def poly(self, pts, color, stroke=None):
        points = [self.project(p) for p in pts]
        if any(p is None for p in points):
            return
        arr = np.array(points, np.int32)
        cv2.fillPoly(self.frame, [arr], color, cv2.LINE_AA)
        if stroke:
            cv2.polylines(self.frame, [arr], True, stroke, 1, cv2.LINE_AA)

    def line(self, a, b, color, width=1, glow=False):
        p, q = self.project(a), self.project(b)
        if p is None or q is None:
            return
        cv2.line(self.frame, p, q, color, width, cv2.LINE_AA)
        if glow:
            cv2.line(self.glow, p, q, color, width+2, cv2.LINE_AA)

    def block(self, x0, x1, y0, y1, z0, z1, front, side, top, edges=False):
        if z0 < self.z + .4:
            return
        self.poly([(x0,y0,z1),(x1,y0,z1),(x1,y1,z1),(x0,y1,z1)],front)
        self.poly([(x0,y0,z0),(x0,y0,z1),(x0,y1,z1),(x0,y1,z0)],side)
        self.poly([(x1,y0,z0),(x1,y0,z1),(x1,y1,z1),(x1,y1,z0)],side)
        self.poly([(x0,y1,z0),(x1,y1,z0),(x1,y1,z1),(x0,y1,z1)],top)
        if edges:
            for a,b in [((x0,y0,z0),(x0,y1,z0)),((x1,y0,z0),(x1,y1,z0)),((x0,y1,z0),(x1,y1,z0))]:
                self.line(a,b,(95,105,125))

    def sculpture(self):
        z = self.z + 13
        if self.room == 0: # The Infinite Archive
            for k in range(24):
                x = ((k*7.31)%11)-5.5
                y = -1.2+((k*3.13)%6)
                zz = z+(k*2.23)%18
                self.poly([(x,y,zz),(x+.5,y,zz),(x+.5,y+.85,zz),(x,y+.85,zz)],(54,56,57),(84,92,107))
                self.line((x+.1,y+.64,zz),(x+.38,y+.64,zz),(130,141,157))
        elif self.room == 1: # The Digital Forge
            for k in range(10):
                x=((k*5.3)%10)-5
                y=-1+((k*2.7)%5)
                zz=z+(k*2.7)%17
                self.block(x-.58,x+.58,y-.58,y+.58,zz,zz+1.3,(34,36,40),(21,22,24),(72,69,59),True)
        elif self.room == 2: # The Learning Paradox
            for k in range(11):
                zz=z-4+k*2.8
                y=-3.2+k*.32
                self.block(-3.1,3.1,y,y+.33,zz,zz+1.2,(53,53,56),(32,32,36),(87,85,82))
                self.line((-3.1,y+.33,zz),(3.1,y+.33,zz),(119,131,145))
        elif self.room == 3: # The Path of Clarity
            for k in range(1,80):
                zz=z-4+k*.35
                pz=z-4+(k-1)*.35
                x=math.sin(k*.1)*1.05
                px=math.sin((k-1)*.1)*1.05
                self.line((px,-3.21,pz),(x,-3.21,zz),(159,190,228),2,True)
        else: # The Living Canvas
            for k in range(9):
                zz=z+k*2.4
                for j in range(18):
                    th=j/17*2.4*math.pi+k*.18
                    th2=(j+1)/17*2.4*math.pi+k*.18
                    self.line((3*math.sin(th),.2+2.1*math.cos(th),zz),
                              (3*math.sin(th2),.2+2.1*math.cos(th2),zz),(188,194,196),2)

    def draw(self):
        z0, z1 = self.z+.5, self.z+100
        self.poly([(-11,-3.6,z0),(11,-3.6,z0),(11,-3.6,z1),(-11,-3.6,z1)],(36,35,34))
        self.poly([(-11,6.5,z0),(11,6.5,z0),(11,6.5,z1),(-11,6.5,z1)],(17,17,17))
        self.poly([(-11,-3.6,z0),(-11,-3.6,z1),(-11,6.5,z1),(-11,6.5,z0)],(30,29,28))
        self.poly([(11,-3.6,z0),(11,-3.6,z1),(11,6.5,z1),(11,6.5,z0)],(26,25,24))
        for z in np.arange(math.ceil(self.z/3.6)*3.6,self.z+75,3.6):
            self.line((-10.95,-3.55,z),(10.95,-3.55,z),(48,49,51))
        for x in np.arange(-10,11,2):
            self.line((x,-3.55,z0),(x,-3.55,z1),(44,44,47))
        for z in np.arange(math.ceil(self.z/7)*7,self.z+80,7):
            for x in [-10.9,10.9]:
                self.line((x,-3.5,z),(x,6.3,z),(46,44,44))
        for k in range(9,-1,-1):
            z=math.ceil(self.z/9)*9+k*9+3.8
            self.block(-8.35,-6.55,-3.55,6.35,z,z+2.9,(62,61,59),(30,30,29),(77,75,70),True)
            self.block(6.55,8.35,-3.55,6.35,z,z+2.9,(61,61,58),(29,29,27),(76,72,67),True)
            self.block(-8.35,8.35,4.75,6.35,z,z+2.9,(61,59,57),(32,31,30),(81,78,71),True)
            for a,b in [((-6.5,-3.4,z),(-6.5,4.7,z)),((6.5,-3.4,z),(6.5,4.7,z)),((-6.5,4.7,z),(6.5,4.7,z))]:
                self.line(a,b,(156,169,179),1,True)
            if k%2==0:
                self.block(-10,-8.6,-3.55,.15,z+3,z+5,(45,44,43),(28,28,28),(75,68,60))
                self.block(8.6,10,-3.55,.15,z+3,z+5,(41,41,40),(28,28,28),(75,68,60))
        self.sculpture()
        for z in np.arange(math.ceil(self.z/9)*9+4,self.z+65,9):
            self.line((-2.4,6.26,z),(2.4,6.26,z),(174,190,215),2,True)
        glow=cv2.GaussianBlur(self.glow,(0,0),9)
        self.frame=cv2.addWeighted(self.frame,1.0,glow,.25,0)
        self.frame=(self.frame.astype(np.float32)*(1-VIGNETTE[:,:,None])).clip(0,255).astype(np.uint8)
        # Framing only; do not burn text into video because the web hero has HTML headings.
        cv2.rectangle(self.frame,(0,0),(W,15),(5,7,9),-1)
        cv2.rectangle(self.frame,(0,H-15),(W,H),(5,7,9),-1)
        blend=min(self.phase,1-self.phase)
        fade=np.clip((.09-blend)/.09,0,1)*.65
        if fade:
            self.frame=(self.frame*(1-fade)).astype(np.uint8)
        return self.frame

def main():
    raw = OUTPUT / "hero-raw.mp4"
    writer = cv2.VideoWriter(str(raw), cv2.VideoWriter_fourcc(*"mp4v"), FPS, (W,H))
    assert writer.isOpened(), "Unable to encode concept video"
    for i in range(SECONDS*FPS):
        frame = Museum(i/FPS).draw()
        writer.write(frame)
        if i == 20:
            cv2.imwrite(str(OUTPUT/"poster.jpg"), frame)
    writer.release()
    assert raw.exists() and raw.stat().st_size>100_000

if __name__ == "__main__":
    main()
