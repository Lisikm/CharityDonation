from django import forms
from django.core.exceptions import ValidationError

from donation.models import Donation


class DonationForm(forms.ModelForm):
    class Meta:
        model = Donation
        fields = ['quantity', 'institution', 'address', 'phone_number', 'city', 'zip_code',
                  'pick_up_date', 'pick_up_time', 'pick_up_comment', 'categories']


class TakenForm(forms.Form):
    donations = forms.ModelChoiceField(queryset=Donation.objects.none())
    is_taken = forms.BooleanField(required=False)

    def __init__(self, *args, user=None, **kwargs):
        super().__init__(*args, **kwargs)
        if user is not None:
            self.fields["donations"].queryset = Donation.objects.filter(user=user)


class PassForm(forms.Form):
    old_password = forms.CharField(label="Podaj stare hasło", widget=forms.PasswordInput, max_length=64)
    new_password_1 = forms.CharField(label="Podaj nowe hasło", widget=forms.PasswordInput, max_length=64)
    new_password_2 = forms.CharField(label="Powtórz nowe hasło", widget=forms.PasswordInput, max_length=64)

    def __init__(self, user, *args, **kwargs):
        super(PassForm, self).__init__(*args, **kwargs)
        self.user = user

    def clean(self):
        cleaned_data = super().clean()
        if self.user.check_password(cleaned_data["old_password"]):
            if cleaned_data["new_password_1"] != cleaned_data["new_password_2"]:
                raise ValidationError("Nowe hasło nie jest identyczne")
        else:
            raise ValidationError("Aktualne hasło nieprawidłowe")