document.addEventListener("DOMContentLoaded", function() {
  /**
   * HomePage - Help section
   */
  class Help {
    constructor($el) {
      this.$el = $el;
      this.$buttonsContainer = $el.querySelector(".help--buttons");
      this.$slidesContainers = $el.querySelectorAll(".help--slides");
      this.currentSlide = this.$buttonsContainer.querySelector(".active").parentElement.dataset.id;
      this.init();
    }

    init() {
      this.events();
    }

    events() {
      /**
       * Slide buttons
       */
      this.$buttonsContainer.addEventListener("click", e => {
        if (e.target.classList.contains("btn")) {
          this.changeSlide(e);
        }
      });

      /**
       * Pagination buttons
       */
      this.$el.addEventListener("click", e => {
        if (e.target.classList.contains("btn") && e.target.parentElement.parentElement.classList.contains("help--slides-pagination")) {
          this.changePage(e);
        }
      });
    }

    changeSlide(e) {
      e.preventDefault();
      const $btn = e.target;

      // Buttons Active class change
      [...this.$buttonsContainer.children].forEach(btn => btn.firstElementChild.classList.remove("active"));
      $btn.classList.add("active");

      // Current slide
      this.currentSlide = $btn.parentElement.dataset.id;

      // Slides active class change
      this.$slidesContainers.forEach(el => {
        el.classList.remove("active");

        if (el.dataset.id === this.currentSlide) {
          el.classList.add("active");
        }
      });
    }

    /**
     * TODO: callback to page change event
     */
    changePage(e) {
      e.preventDefault();
      const page = e.target.dataset.page;
      const page_btns = e.target.parentElement.parentElement.querySelectorAll(".btn")
      const pages = e.target.parentElement.parentElement.parentElement.querySelectorAll(".help--slides-items");
      pages.forEach(elem => {
        if (elem.dataset.page === page) {
          elem.classList.remove("non_vis")
        } else {
          elem.classList.add("non_vis")
        }
      })
      page_btns.forEach(btn => {
        btn.classList.remove("active")
      })
      e.target.classList.add("active")
    }
  }
  const helpSection = document.querySelector(".help");
  if (helpSection !== null) {
    new Help(helpSection);
  }

  /**
   * Form Select
   */
  class FormSelect {
    constructor($el) {
      this.$el = $el;
      this.options = [...$el.children];
      this.init();
    }

    init() {
      this.createElements();
      this.addEvents();
      this.$el.parentElement.removeChild(this.$el);
    }

    createElements() {
      // Input for value
      this.valueInput = document.createElement("input");
      this.valueInput.type = "text";
      this.valueInput.name = this.$el.name;

      // Dropdown container
      this.dropdown = document.createElement("div");
      this.dropdown.classList.add("dropdown");

      // List container
      this.ul = document.createElement("ul");

      // All list options
      this.options.forEach((el, i) => {
        const li = document.createElement("li");
        li.dataset.value = el.value;
        li.innerText = el.innerText;

        if (i === 0) {
          // First clickable option
          this.current = document.createElement("div");
          this.current.innerText = el.innerText;
          this.dropdown.appendChild(this.current);
          this.valueInput.value = el.value;
          li.classList.add("selected");
        }

        this.ul.appendChild(li);
      });

      this.dropdown.appendChild(this.ul);
      this.dropdown.appendChild(this.valueInput);
      this.$el.parentElement.appendChild(this.dropdown);
    }

    addEvents() {
      this.dropdown.addEventListener("click", e => {
        const target = e.target;
        this.dropdown.classList.toggle("selecting");

        // Save new value only when clicked on li
        if (target.tagName === "LI") {
          this.valueInput.value = target.dataset.value;
          this.current.innerText = target.innerText;
        }
      });
    }
  }
  document.querySelectorAll(".form-group--dropdown select").forEach(el => {
    new FormSelect(el);
  });

  /**
   * Hide elements when clicked on document
   */
  document.addEventListener("click", function(e) {
    const target = e.target;
    const tagName = target.tagName;

    if (target.classList.contains("dropdown")) return false;

    if (tagName === "LI" && target.parentElement.parentElement.classList.contains("dropdown")) {
      return false;
    }

    if (tagName === "DIV" && target.parentElement.classList.contains("dropdown")) {
      return false;
    }

    document.querySelectorAll(".form-group--dropdown .dropdown").forEach(el => {
      el.classList.remove("selecting");
    });
  });

  /**
   * Switching between form steps
   */
  class FormSteps {
    constructor(form) {
      this.$form = form;
      this.$next = form.querySelectorAll(".next-step");
      this.$prev = form.querySelectorAll(".prev-step");
      this.$step = form.querySelector(".form--steps-counter span");
      this.currentStep = 1;

      this.$stepInstructions = form.querySelectorAll(".form--steps-instructions p");
      const $stepForms = form.querySelectorAll("form > div");
      this.slides = [...this.$stepInstructions, ...$stepForms];

      this.init();
    }

    /**
     * Init all methods
     */
    init() {
      this.events();
      this.updateForm();
    }

    /**
     * All events that are happening in form
     */
    events() {
      // Next step
      this.$next.forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault();
          this.currentStep++;
          this.updateForm();
        });
      });

      // Previous step
      this.$prev.forEach(btn => {
        btn.addEventListener("click", e => {
          e.preventDefault();
          this.currentStep--;
          this.updateForm();
        });
      });

      // Form submit
      this.$form.querySelector("form").addEventListener("submit", e => this.submit(e));
    }

    /**
     * Update form front-end
     * Show next or previous section etc.
     */
    step_1_categories()  {
        let inputs = document.querySelector("form").firstElementChild.querySelectorAll("input")
        let categories = []
        inputs.forEach(input => {
          if (input.checked === true) {
            categories.push(input.parentElement.querySelector(".description").innerText)
          }
        })
        return categories
      }

    step_4_data() {
      let address = document.querySelector("[name='address']").value
      let city = document.querySelector("[name='city']").value
      let zip_code = document.querySelector("[name='zip_code']").value
      let phone_number = document.querySelector("[name='phone_number']").value
      let pick_up_date = document.querySelector("[name='pick_up_date']").value
      let pick_up_time = document.querySelector("[name='pick_up_time']").value
      let pick_up_comment = document.querySelector("[name='pick_up_comment']").value
      if (!pick_up_comment) {
        pick_up_comment = "Brak uwag"
      }
      let form_4_data = {
        "address":address,
        "city":city,
        "zip_code":zip_code,
        "phone_number":phone_number,
        "pick_up_date":pick_up_date,
        "pick_up_time":pick_up_time,
        "pick_up_comment":pick_up_comment,
      }
      return form_4_data
    }


    updateForm() {
      this.$step.innerText = this.currentStep;

      // TODO: Validation




      if (this.$step.innerText === "3") {
        if (document.querySelector("#no-choice")) {
          document.querySelector("#no-choice").remove()
        }
        let categories = this.step_1_categories()
        let step_3 = this.$form.querySelector("form [data-step='3']")
        let divs = step_3.querySelectorAll(".form-group--checkbox")
        divs.forEach(div => {
          div.classList.remove("category-none")
          div.classList.add("category")
          let div_categories = div.querySelectorAll("div .category-none")
          if (div_categories.length !== 0) {
            categories.forEach(cat => {
              let valid = false
              for (let elem of div_categories) {
                if (elem.innerText === cat){
                  valid = true
                  break
                }
              }
              if (!valid) {
                div.classList.remove("category")
                div.classList.add("category-none")
              }
            })
          }
          else {
            div.classList.remove("category")
            div.classList.add("category-none")
          }
        })
        let possible_choices = step_3.querySelectorAll(".category")
        if (possible_choices.length === 0){
          let no_choice = document.createElement("div")
          no_choice.id = "no-choice"
          no_choice.innerHTML = "<h4>Brak organizacji spełniających warunki.</h4>"
          step_3.firstElementChild.appendChild(no_choice)
        }
      }

      this.slides.forEach(slide => {
        slide.classList.remove("active");

        if (slide.dataset.step == this.currentStep) {
          slide.classList.add("active");
        }
      });

      this.$stepInstructions[0].parentElement.parentElement.hidden = this.currentStep >= 6;
      this.$step.parentElement.hidden = this.currentStep >= 6;

      // TODO: get data from inputs and show them in summary

      if (this.$step.innerText === "4") {
        let summary_btn = document.querySelector("form [data-step='4']").querySelector(".next-step");
        summary_btn.addEventListener("click", evt => {
          let categories = this.step_1_categories()
          let quantity = document.querySelector("[name='quantity']").value
          let step_3_divs = document.querySelectorAll(".category")
          let institution = ""
          step_3_divs.forEach(div => {
            if (div.querySelector("input").checked) {
              institution = div.querySelector(".title").innerText
            }
          })
          let form_4_data = this.step_4_data()
          let summary = document.querySelector(".summary")
          let summary_bags = "" + quantity
          if (quantity < 2) {
            summary_bags = summary_bags + " worek z: "
          } else if (quantity < 5) {
            summary_bags = summary_bags + " worki z: "
          } else {
            summary_bags = summary_bags + " worków z: "
          }
          categories.forEach(e => {
            if (categories.indexOf(e) === categories.length-1) {
              summary_bags = summary_bags + e
            } else {
              summary_bags = summary_bags + e + ", "
            }
          })
          summary.querySelector(".icon-bag").nextElementSibling.innerText = summary_bags
          summary.querySelector(".icon-hand").nextElementSibling.innerText = "Odbiorca: " + institution
          summary.lastElementChild.firstElementChild.querySelector("ul").innerHTML = `
          <li>${form_4_data.address}</li>
          <li>${form_4_data.city}</li>
          <li>${form_4_data.zip_code}</li>
          <li>${form_4_data.phone_number}</li>`
          summary.lastElementChild.lastElementChild.querySelector("ul").innerHTML = `
          <li>${form_4_data.pick_up_date}</li>
          <li>${form_4_data.pick_up_time}</li>
          <li>${form_4_data.pick_up_comment}</li>`
        })
        document.querySelector("#error").innerText = ""
      }
    }

    /**
     * Submit form
     *
     * TODO: validation, send data to server
     */
    submit(e) {
      e.preventDefault();
      let inputs = document.querySelector("form").firstElementChild.querySelectorAll("input")
      let categories = []
      inputs.forEach(input => {
        if (input.checked === true) {
            categories.push(input.value)
          }
        })
      let quantity = document.querySelector("[name='quantity']").value
      let step_3_divs = document.querySelectorAll(".category")
      let institution = ""
      step_3_divs.forEach(div => {
        if (div.querySelector("input").checked) {
          institution = div.querySelector("input").value
        }
      })
      let form_4_data = this.step_4_data();
      let token = document.querySelector("[name='csrfmiddlewaretoken']").value;
      
      let dataForm = new FormData();
      dataForm.append("address", form_4_data.address);
      dataForm.append("city", form_4_data.city);
      dataForm.append("zip_code", form_4_data.zip_code);
      dataForm.append("phone_number", form_4_data.phone_number);
      dataForm.append("pick_up_date", form_4_data.pick_up_date);
      dataForm.append("pick_up_time", form_4_data.pick_up_time);
      dataForm.append("pick_up_comment", form_4_data.pick_up_comment);
      categories.forEach(category => {
        dataForm.append("categories", category)
      })
      dataForm.append("quantity", quantity);
      dataForm.append("institution", institution);
      dataForm.append('csrfmiddlewaretoken', token);
      fetch('http://127.0.0.1:8000/add_donation/', {
        method: 'post',
        body: dataForm,
    })
          .then( resp => resp.json())
          .then( data => {
            if (data.site) {
              window.location.replace(data.site)
            } else {
              document.querySelector("#error").innerText = data.error;
            }
          })
          .catch( error => {
              document.querySelector("#error").innerText = "Wprowadzono błędne dane";
          })
    }
  }
  const form = document.querySelector(".form--steps");
  if (form !== null) {
    new FormSteps(form);
  }
});
