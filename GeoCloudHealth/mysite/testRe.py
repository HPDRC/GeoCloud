import re
import sys
import traceback

if  len(sys.argv) != 3:
    print 'python testre.py [pattern str] [calculate str]' 
    exit(0)
pattern = sys.argv[1]
calcstr = sys.argv[2]
try: 
    p = re.compile(pattern)
    rst = p.findall(calcstr)
    print rst
except:
    print "*** print_exception"
    traceback.print_exc()



