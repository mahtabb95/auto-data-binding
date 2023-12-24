
from django.contrib import admin
from .dbmodels import Hidden, Tperson, Tpipe, Tpipes, Book, Sysdiagrams

admin.site.register(Hidden)

admin.site.register(Tperson)

admin.site.register(Tpipe)

admin.site.register(Tpipes)

admin.site.register(Book)

admin.site.register(Sysdiagrams)
