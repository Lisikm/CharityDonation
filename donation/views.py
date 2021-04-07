from django.urls import reverse

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.mixins import LoginRequiredMixin
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.views import View
from django.core.paginator import Paginator

from donation.forms import DonationForm, TakenForm, PassForm
from donation.models import Donation, Institution, User, Category


class LandingPageView(View):
    def get(self, request):
        supported_institutions = []
        for donation in Donation.objects.all():
            if donation.institution not in supported_institutions:
                supported_institutions.append(donation.institution)
        bags = sum(Donation.objects.all().values_list('quantity', flat=True))
        fundations_paginator = Paginator(Institution.objects.filter(type="fundacja"), 5)
        fundations_pages = [fundations_paginator.page(x) for x in fundations_paginator.page_range]
        non_gov_orgs_paginator = Paginator(Institution.objects.filter(type="organizacja pozarządowa"), 5)
        non_gov_orgs_pages = [non_gov_orgs_paginator.page(x) for x in non_gov_orgs_paginator.page_range]
        local_collections_paginator = Paginator(Institution.objects.filter(type="zbiórka lokalna"), 5)
        local_collections_pages = [local_collections_paginator.page(x) for x in local_collections_paginator.page_range]
        return render(request, "index.html", {
            "bags":bags,
            "institutions":len(supported_institutions),
            "fundations_pages": fundations_pages,
            "non_gov_orgs_pages": non_gov_orgs_pages,
            "local_collections_pages": local_collections_pages,
        })


class AddDonationView(LoginRequiredMixin, View):
    def get(self, request):
        categories = Category.objects.all()
        institutions = Institution.objects.all()
        return render(request, "adddonation.html", {"categories":categories, "institutions":institutions})

    def post(self, request):
        form = DonationForm(request.POST)
        if form.is_valid():
            donation = Donation.objects.create(
                    quantity=form.cleaned_data['quantity'],
                    institution=form.cleaned_data['institution'],
                    address=form.cleaned_data['address'],
                    phone_number=form.cleaned_data['phone_number'],
                    city=form.cleaned_data['city'],
                    zip_code=form.cleaned_data['zip_code'],
                    pick_up_date=form.cleaned_data['pick_up_date'],
                    pick_up_time=form.cleaned_data['pick_up_time'],
                    pick_up_comment=form.cleaned_data['pick_up_comment'],
                    user=request.user
                )
            categories = form.cleaned_data["categories"]
            donation.categories.set(categories)
            response_data = {
                'site': reverse("form-confirmation")
            }
            return JsonResponse(response_data)
        else:
            response_data = {
                'error': "Wprowadzono błędne dane"
            }
            return JsonResponse(response_data)


class FormConfView(View):
    def get(self, request):
        return render(request, 'form-confirmation.html')


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
            return redirect("login")
        return redirect("login")


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


class ProfileView(View):
    def get(self, request):
        return render(request, "profile.html", {"donations":Donation.objects.filter(user=request.user)})

    def post(self, request):
        form = TakenForm(request.POST, user=request.user)
        if form.is_valid():
            donation = form.cleaned_data["donations"]
            donation.is_taken = form.cleaned_data["is_taken"]
            donation.save()
            return redirect("profile")
        else:
            return redirect("profile")


class EditUserPassView(View):
    def get(self, request):
        form = PassForm(user=request.user)
        return render(request, "changepass.html", {"form":form})

    def post(self, request):
        form = PassForm(request.user, request.POST)
        if form.is_valid():
            request.user.set_password(form.cleaned_data["new_password_1"])
            request.user.save()
            return render(request, "changepass.html", {"success": "Hasło zostało zmienione"})
        return render(request, "changepass.html", {"form": form})