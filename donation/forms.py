from django import forms

from donation.models import Donation


class DonationForm(forms.ModelForm):
    class Meta:
        model = Donation
        fields = ['quantity', 'institution', 'address', 'phone_number', 'city', 'zip_code',
                  'pick_up_date', 'pick_up_time', 'pick_up_comment', 'categories']


class TakenForm(forms.Form):
    donations = forms.ModelChoiceField(queryset=Donation.objects.none())
    is_taken = forms.BooleanField()

    def __init__(self, *args, user=None, **kwargs):
        super().__init__(*args, **kwargs)
        if user is not None:
            self.fields["donations"].queryset = Donation.objects.filter(user=user)