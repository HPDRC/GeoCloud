from django.http import HttpResponse

def regression(request):
    return HttpResponse("This is regression")

def meancenter(request):
    return HttpResponse("This is meancenter")
