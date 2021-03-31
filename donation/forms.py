from django import forms

from donation.models import Donation


class DonationForm(forms.ModelForm):
    class Meta:
        model = Donation
        fields = ['quantity', 'institution', 'address', 'phone_number', 'city', 'zip_code',
                  'pick_up_date', 'pick_up_time', 'pick_up_comment', 'categories']