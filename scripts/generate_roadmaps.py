"""Regenerate the downloadable, illustrated career roadmap PDFs."""
import json
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.pdfgen import canvas
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.colors import HexColor, Color, white
from reportlab.lib.pagesizes import A4
root=Path(__file__).resolve().parent.parent
records=json.loads((root/'src/data/careercompass-content.json').read_text(encoding='utf-8-sig'))['careers']+json.loads((root/'src/data/vocational-careers.json').read_text(encoding='utf-8-sig'))
W,H=A4
navy=HexColor('#14204b'); muted=HexColor('#52617b')
palette=['#6366f1','#0891b2','#d97706','#db2777','#059669']
def text(c,value,x,y,width,size=11,color=navy,bold=False):
 style=ParagraphStyle('body',fontName='Helvetica-Bold' if bold else 'Helvetica',fontSize=size,leading=size*1.4,textColor=color)
 p=Paragraph(escape(value),style);_,h=p.wrap(width,900);p.drawOn(c,x,y-h);return h

def illustration(c,x,y):
 # Original vector illustration: a study desk, books, laptop and goal flag.
 c.setFillColor(HexColor('#354483'));c.circle(x+58,y+54,62,fill=1,stroke=0)
 c.setFillColor(HexColor('#a5b4fc'));c.roundRect(x+8,y+40,94,62,7,fill=1,stroke=0)
 c.setFillColor(HexColor('#182451'));c.roundRect(x+14,y+47,82,49,3,fill=1,stroke=0)
 c.setStrokeColor(HexColor('#5eead4'));c.setLineWidth(3)
 for a,b in [(57,80),(50,73),(57,66)]:c.line(x+a,y+b,x+a+18,y+b)
 c.setFillColor(HexColor('#e0e7ff'));c.roundRect(x,y+34,110,7,3,fill=1,stroke=0)
 for yy,col,ww in [(17,'#fb923c',82),(7,'#5eead4',95)]:
  c.setFillColor(HexColor(col));c.roundRect(x+14,y+yy,ww,8,2,fill=1,stroke=0)
 c.setStrokeColor(white);c.setLineWidth(2);c.line(x+114,y+70,x+114,y+120)
 path=c.beginPath();path.moveTo(x+114,y+120);path.lineTo(x+144,y+109);path.lineTo(x+114,y+99);path.close()
 c.setFillColor(HexColor('#fbbf24'));c.drawPath(path,fill=1,stroke=0)
 c.setFillColor(HexColor('#5eead4'));c.circle(x-3,y+115,4,fill=1,stroke=0)

def generate(career):
 dest=root/'public/roadmaps'/f"{career['slug']}.pdf"
 c=canvas.Canvas(str(dest),pagesize=A4);c.setTitle(career['title']+' | CareerCompass Roadmap');c.setAuthor('CareerCompass')
 c.setFillColor(HexColor('#f4f6fc'));c.rect(0,0,W,H,fill=1,stroke=0)
 c.setFillColor(navy);c.rect(0,H-212,W,212,fill=1,stroke=0)
 c.setFillColor(HexColor('#202e64'));c.circle(W-5,H-5,120,fill=1,stroke=0)
 text(c,'CAREERCOMPASS / YOUR NEXT CHAPTER',34,H-25,370,9,HexColor('#a5b4fc'),True)
 titleh=text(c,career['title'],34,H-54,350,25,white,True)
 text(c,career['summary'],34,H-66-titleh,340,10.5,HexColor('#dbeafe'))
 illustration(c,W-176,H-194)
 text(c,'YOUR PATHWAY',34,H-240,300,11,navy,True)
 text(c,'Explore. Learn. Build your future.',34,H-259,400,10,muted)
 y=H-290
 for i,step in enumerate(career['path']):
  col=HexColor(palette[i%len(palette)])
  style=ParagraphStyle('step',fontName='Helvetica',fontSize=10.5,leading=14,textColor=navy)
  p=Paragraph(escape(step),style);_,ph=p.wrap(W-150,600);height=max(66,ph+36)
  if i<len(career['path'])-1:
   c.setStrokeColor(HexColor('#c7d2fe'));c.setLineWidth(2);c.line(51,y-21,51,y-height-15)
  c.setFillColor(white);c.roundRect(80,y-height,W-114,height,12,fill=1,stroke=0)
  c.setFillColor(col);c.roundRect(80,y-height,4,height,2,fill=1,stroke=0)
  c.circle(51,y-21,16,fill=1,stroke=0)
  c.setFont('Helvetica-Bold',12);c.setFillColor(white);c.drawCentredString(51,y-25,str(i+1))
  text(c,'MILESTONE '+str(i+1).zfill(2),98,y-10,350,8,col,True)
  p.drawOn(c,98,y-28-ph)
  y-=height+12
 text(c,'SKILLS TO BUILD',34,y-8,400,10,navy,True)
 sh=text(c,'  /  '.join(career['skills']),34,y-28,W-68,10,muted)
 y-=sh+52
 c.setFillColor(HexColor('#dff6f0'));c.roundRect(34,y-50,W-68,52,10,fill=1,stroke=0)
 text(c,'ONE STEP CLOSER TO YOUR GOAL',47,y-8,W-94,9,HexColor('#087f6b'),True)
 text(c,'Try a project, talk to a mentor and turn your next milestone into an action.',47,y-25,W-94,9,navy)
 assert y-50>67, f'Layout overflow: {career["slug"]}'
 text(c,'Guidance only. Verify current admissions and professional requirements with official institutions.',34,48,W-68,8,muted)
 text(c,'CareerCompass | Personal learning roadmap',34,28,W-68,8,muted)
 c.save()
for career in records:generate(career)
print('Generated',len(records),'colour illustrated roadmap PDFs')
