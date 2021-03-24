from django.contrib.auth.models import User
from django.db import models

INSTITUTION_TYPE = (
    ("fundacja", "fundacja"),
    ("organizacja pozarządowa", "organizacja pozarządowa"),
    ("zbiórka lokalna", "zbiórka lokalna"),
)


class Category(models.Model):
    name = models.CharField(max_length=128)


class Institution(models.Model):
    name = models.CharField(max_length=255)
    description = models.CharField(max_length=255)
    type = models.CharField(choices=INSTITUTION_TYPE, default="fundacja", max_length=128)
    categories = models.ManyToManyField(Category)


class Donation(models.Model):
    quantity = models.IntegerField()
    categories = models.ManyToManyField(Category)
    institution = models.ForeignKey(Institution, on_delete=models.CASCADE)
    address = models.CharField(max_length=128)
    phone_number = models.IntegerField()
    city = models.CharField(max_length=128)
    zip_code = models.CharField(max_length=6)
    pick_up_date = models.DateField()
    pick_up_time = models.TimeField()
    pick_up_comment = models.CharField(max_length=255)
    user = models.ForeignKey(User, null=True, default=None, on_delete=models.CASCADE)
