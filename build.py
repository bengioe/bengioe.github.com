import sys, os

header = """
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<html>
<head>
  <title>Emmanuel Bengio</title>
  <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js"></script>
  <script type="text/javascript" src="{0}site.js"></script>
  <link rel="stylesheet" type="text/css" href="{0}style.css">
</head>
<body>
"""

menu = """

  <div id="menu">
    <center>.
      <span class="menulink"> 
	<a href="{0}index.html">Home</a>
      </span>.
      <span class="menulink"> 
	<a href="{0}projects.html">Projects</a>
      </span>.
      <span class="menulink"> 
	<a href="{0}thoughts.html">Thoughts</a>
      </span>.
      <span class="menulink"> 
	<a href="{0}about.html">About me</a>
      </span>.
    </center>
  </div>
  <div id="bbody">
"""

bottom = """
  </div>
</body>
</html>
"""

def pdate(s):
    s = [int(i) for i in s.split("/")]
    return s[0]*31*12+s[1]*31+s[2]

def process(s):
    import re
    bits = [[re.compile("==(.+)=="),"<h3>\1</h3><p>",1],
            ["\n\n","</p><p>",0],
            [re.compile("\_([\S]+)\_"),"<b/>\1</b>",1],
            [re.compile("\*([\S]+)\*"),"<i/>\1</i>",1],
            [re.compile("\[([\S]+)\]"),"<a href=\1>\1</a>",1],
            [re.compile("\[([\S]+)(.+)\]"),"<a href=\1>\2</a>",2],
            ]
    for bit in bits:
        if type(bit[0]) == str:
            s = s.replace(bit[0],bit[1])
            continue
        mch = bit[0].search(s)
        while mch and len(mch.groups()) > 0:
            k = bit[1]
            for i in range(bit[2]):
                k = k.replace(chr(i+1),mch.group(i+1))
            s = s[:mch.start()] + k + s[mch.end():]
            mch = bit[0].search(s)
    return s

tlist = []
l = os.listdir("src/thoughts")
for i in l:
    if i.endswith("~"): continue
    print(i)
    data = file("src/thoughts/"+i,'r').read()
    title,data = data[:data.index("!~")],data[data.index("!~")+2:]
    title = title.split(",")
    tlist.append([i,title[0],pdate(title[1])])
    data = header.format("../") + menu.format("../") + process(data) + bottom
    file("thoughts/"+i+".html",'w').write(data)

tlist.sort(lambda a,b: 1 if a[2]>b[2] else -1)

file("thoughts.html",'w').write(
    header.format("") + menu.format("") + \
        "Here is a list of things I wrote. Hopefully you will find inspiring words among the ramblings of a young person.\n<center>\n"+"\n".join(
        ["<a href='thoughts/"+i[0]+".html'>"+i[1]+"</a></br>\n"
         for i in tlist]) +"</center>" + bottom)
    

for i in os.listdir("src/"):
    if not i.endswith(".src"): continue
    file(i[:-4]+".html",'w').write(
        header.format("") + menu.format("") + process(file("src/"+i,'r').read()) + bottom)
        
        
