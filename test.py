print("Hello word")

# tuple --> unchangable ()
tp = (1,2,3)
# tp[0] = 4
print(tp[0])

# h = 7/0
a = 3
b= 4
# c= 5 
a = a + b
b = a - b
a = a - b

print(a)
print(b)


def new():
    try:
        h = 7/0
    except:
        print("Error in new func")
        
        
new()