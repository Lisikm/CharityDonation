from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.views import View
from django.core.paginator import Paginator

from donation.models import Donation, Institution, User


class LandingPageView(View):
    def get(self, request):
        supported_institutions = []
        for donation in Donation.objects.all():
            if donation.institution not in supported_institutions:
                supported_institutions.append(donation.institution)
        bags = sum(Donation.objects.all().values_list('quantity', flat=True))
        pag_fundations = Paginator(Institution.objects.filter(type="fundacja"), 5)
        fundations = pag_fundations.get_page(request.GET.get("fun_page"))
        non_gov_orgs = Institution.objects.filter(type="organizacja pozarządowa")
        local_collections = Institution.objects.filter(type="zbiórka lokalna")
        return render(request, "index.html", {
            "bags":bags,
            "institutions":len(supported_institutions),
            "fundations": fundations,
            "non_gov_orgs": non_gov_orgs,
            "local_collections": local_collections,
        })


class AddDonationView(View):
    def get(self, request):
        return render(request, "adddonation.html")


class LoginView(View):
    def get(self, request):
        return render(request, "login.html")

    def post(self, request):
        email = request.POST["email"]
        password = request.POST["password"]
        if User.objects.filter(email=email):
            user = authenticate(email=email, password=password)
            if user:
                login(request, user)
            return redirect("index")
        return redirect("register")


class LogoutView(View):
    def get(self, request):
        logout(request)
        return redirect("index")



class RegisterView(View):
    def get(self, request):
        return render(request, "register.html")

    def post(self, request):
        name = request.POST.get("name")
        surname = request.POST.get("surname")
        email = request.POST.get("email")
        password = request.POST.get("password")
        password2 = request.POST.get("password2")
        if name and surname and email and password and password2 and password == password2:
            User.objects.create_user(email=email, first_name=name, last_name=surname, password=password)
            return redirect("login")

        return render(request, "register.html")