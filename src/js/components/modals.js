
/******************************************************** */


import JustValidate from 'just-validate';
import Inputmask from "inputmask";
import { disableScroll } from '.././functions/disable-scroll';
import { enableScroll } from '.././functions/enable-scroll';
// import { contains } from 'jquery';


function grecaptchaCheck() {
  return !!(document.querySelector('script[src*="www.google.com/recaptcha"]'))
}

export function appointFormInit(selector) {

  let forms = []

  if (typeof selector === 'string') {
    forms = document.querySelectorAll(selector)
    if (!forms.length){      
      return
    }
  }
  else {
    console.log(selector)
    forms.push(selector)
  }

  forms.forEach((form) => {
    console.log('appointFormInit' + selector)
    if (form.classList.contains('validation-attached')) {
      return
    }
    const rules = [
      {
        ruleSelector: 'input[type="tel"]',
        rules: [
          {
            rule: 'required',
            errorMessage: 'Вы не ввели телефон'
          },
        ],
        tel: true,
        telError: 'Телефон указан неверно'
      },
      {
        ruleSelector: 'input[name="name"]',
        rules: [
          {
            rule: 'required',
            errorMessage: 'Вы не ввели Имя'
          },
        ],
      },
    ]

    if (grecaptchaCheck()) {

      let counter = 5
      function captchaInit(form, cId) {
        if (window.grecaptcha?.render) {
          const rId = window.grecaptcha?.render(cId)
          form.dataset.rId = rId
        }
        else if (counter-- != 0) {
          setTimeout(captchaInit, 300, form, cId)

        }
      }
      const captchaId = form.querySelector('.g-recaptcha')?.getAttribute('id');
      if (captchaId) {
        captchaInit(form, captchaId)
      }
    }

    validateForms(form, rules)
    form.classList.add('validation-attached')
  })

}


export default function validateForms(formEl, rules) {
  const form = formEl;
  //console.log(formEl)

  if (!form) {
    console.error('Нет такого селектора!');
    return false;
  }
  if (!rules) {
    console.error('Вы не передали правила валидации!');
    return false;
  }

  const telSelector = form?.querySelector('input[type="tel"]');
  const mailSelector = form?.querySelector('input[type="email"]');


  if (telSelector) {
    const inputMask = new Inputmask({
      mask: '+7 (999) 999-99-99',
      showMaskOnHover: false,
    });
    inputMask.mask(telSelector);
    for (let item of rules) {
      if (item.tel) {
        item.rules.push({
          rule: 'function',
          validator: function () {
            const phone = telSelector.inputmask.unmaskedvalue();
            return phone.length === 10;
          },
          errorMessage: item.telError
        });
      }
    }
  }
  const validation = new JustValidate(form,
    {
      errorLabelCssClass: 'ui-input__error',
      errorLabelStyle: {},
      // errorsContainer: document.querySelector('.error-field'),
      errorFieldCssClass: 'has-error',
      successFieldCssClass: 'is-valid'
    }
  );

  validation.setCurrentLocale('ru')

  for (let item of rules) {
    validation
      .addField(item.ruleSelector, item.rules);
  }
  function clearForm() {
    form.reset();

    form.querySelectorAll(".ui-input.is-focused").forEach((el) => {
      el.classList.remove('is-focused')
    });

  }
  validation.onFail(function (fields) {
    console.log(fields);
  })
  function showError(form, msg) {
    // Заменяет текст в блоке, скрывает форму и показывает ответ
    const errorCtr = form.querySelector('.error-message-ctr')
    if (errorCtr) {
      errorCtr.innerText = msg
    }
    else{
      const message = document.createElement('h6')
      message.innerText = msg
      form.appendChild(message)
    }
  }
  function showResponse(form, msg) {

    console.log(form)

    //console.log(form.parentElement.parentElement.parentElement.parentElement)
    form.style.display = "none"
    form.parentElement.parentElement.parentElement.parentElement.querySelector('.modal__close-button').style.order = "2"
    form.parentElement.parentElement.parentElement.parentElement.querySelector('.form-order__top').classList.add('form-el_hidden')
    form.parentElement.parentElement.parentElement.parentElement.querySelectorAll('.form-response').forEach((el) => {
      el.classList.add('form-el_active')
    })

  }
  validation.onSuccess(async (submitEvent) => {
    let captchaExist = grecaptchaCheck() || !!(window.grecaptcha)

    const captchaId = form.dataset.rId;
    if (captchaId) {
      grecaptcha.execute(captchaId)
      
    }
    else if (captchaExist) {
      console.error('there is no captcha in form')
    }
    const interval = setInterval(function () {
      if ((captchaExist && grecaptcha.getResponse(captchaId)) || !captchaExist) {
        clearInterval(interval)
        const data = new FormData(submitEvent.target)
        //console.log(submitEvent.target)
        form.classList.add('loading')
        const fetchUrl = form.getAttribute('action') ? form.getAttribute('action') : '/api'
        fetch(fetchUrl, {
          method: 'POST',
          body: data
        }).then(response => {
          console.log(response)
          
          if (!response.ok) {
            response.json()
              .catch(() => {
                form.classList.add('hidden')
                form.classList.remove('loading')
                showError(form, 'Не удалось отправить форму')
                throw new Error(response.status);
              })
              .then(({ message }) => {
                showError(form, message)
                throw new Error(message || response.status);
              });
              form.parentElement.querySelector('form').style.display = 'none'
              form.parentElement.classList.add('sent-request')
              form.parentElement.querySelectorAll('div').forEach((item) => {
                if(!item.classList.contains('form-response')) {
                  item.style.display = 'none'
                }
                else {
                  item.style.display = 'block'
                }
              })
              window.location.href = form.dataset.formPdf
          }
          else {

            form.parentElement.querySelector('form').style.display = 'none'
            form.parentElement.classList.add('sent-request')
            form.parentElement.querySelectorAll('div').forEach((item) => {
              if(!item.classList.contains('form-response')) {
                item.style.display = 'none'
              }
              else {
                item.style.display = 'block'
              }
            })

            console.log('responce is ok')
            showResponse(form)
            form.dataset.redirect ? window.location.replace(form.dataset.redirect) : undefined
            clearForm()
          }

        });

      }
    }, 1000)
  })

};

openModalInit()
// appointFormInit()

function openModalInit() {
  document.querySelectorAll('[js-modal-open]').forEach((el) => {
    const modal = document.querySelector(`.modal[data-modal-name="${el.dataset.modalName}"]`)
    if (modal) {
      el.addEventListener('click', (e) => {
        // console.log(el.dataset)
        console.log("open top btn")
        if(document.querySelector('.usluga-offer')) {
          document.querySelector('.usluga-offer').classList.remove('_visible')
        }
        if (el.dataset.modalHeading ){
          const top = modal.querySelector('.modal__top > span')
          // console.log(top)
          if(top){
            top.innerHTML = el.dataset.modalHeading
          }
          
        }
        modal.classList.add('opened')
        disableScroll()

      })
      modal.classList.add('_inited')
    }
  })
  document.querySelectorAll('[js-modal-close]').forEach((el) => {
    if (el.classList.contains('modal-background') && isMobile()) {
      return
    }
    el.addEventListener('click', (e) => {
      console.log('click on close')
      console.log(e.currentTarget)
      document.querySelectorAll('.modal.opened').forEach((item) => {
        item.classList.remove('opened')
        enableScroll()
        if(document.querySelector('.usluga-offer')) {
          if(e.currentTarget.parentElement.parentElement.parentElement.getAttribute('data-modal-name') === "appoint-form") {
            document.querySelector('.usluga-offer').classList.add('_visible')
          }
        }
        if (item.videoBannerHref) {
          item.querySelector('.modal__body').innerHTML = ''
        }
      })
      enableScroll()
    })
  })
}