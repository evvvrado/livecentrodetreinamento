$('a[href*="#"]')
  // Remove links that don't actually link to anything
  .not('[href="#"]')
  .not('[href="#0"]')
  .click(function(event) {
    // On-page links
    if (
      location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') 
      && 
      location.hostname == this.hostname
    ) {
      // Figure out element to scroll to
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      // Does a scroll target exist?
      if (target.length) {
        // Only prevent default if animation is actually gonna happen
        event.preventDefault();
        $('html, body').animate({
          scrollTop: target.offset().top
        }, 1000, function() {
          // Callback after animation
          // Must change focus!
          var $target = $(target);
          $target.focus();
          if ($target.is(":focus")) { // Checking if the target was focused
            return false;
          } else {
            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
            $target.focus(); // Set focus again
          };
        });
      }
    }
  });


  // Debounce do Lodash
debounce = function(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};


(function(){
	var $target = $('.showin'),
			animationClass = 'anime-start',
			offset = $(window).height() * 3/4;

	function animeScroll() {
		var documentTop = $(document).scrollTop();

		$target.each(function(){
			var itemTop = $(this).offset().top;
			if (documentTop > itemTop - offset) {
				$(this).addClass(animationClass);
			} else {
				$(this).removeClass(animationClass);
			}
		});
	}

	animeScroll();

	$(document).scroll(debounce(function(){
		animeScroll();
	}, 100));
})();


//Slide
const iflSlider={
	redim:false,
	init:function(slider){
		iflSlider.ajustaTamanho(slider);
		slider.find('.sliderBtn button').each(function(idx,btn){
			$(btn).click(function(event){
				let pre=$(slider).find('.sliderPreCorpo');
				let i=$(slider).find('.sliderItem');
				let w=i.outerWidth(true);
				let novo=0;
				if(idx==1 || $(btn).hasClass('proximo'))novo=pre[0].scrollLeft+w;
				else novo=pre[0].scrollLeft-w;
				if('scrollBehavior' in document.documentElement.style)pre[0].scroll({left:novo,behavior:'smooth'});
				else pre.stop(true,true).animate( { scrollLeft : novo } , 300);
			});
		});
	},
	initTodos:function(){
		$('.slider').each(function(idxS,slider){
			iflSlider.init($(slider));
		});
	},
	resizeTodos:function(){
		$('.slider .sliderItem').css('width','');
		$('.slider .sliderPreCorpo').css('width','');
		if(iflSlider.redim){
			clearTimeout(iflSlider.redim);
			iflSlider.redim=false;
		};
		iflSlider.redim=setTimeout(function(){
			$('.slider').each(function(idxS,slider){
				iflSlider.ajustaTamanho($(slider));
				iflSlider.redim=false;
			});
		},100);
	},
	ajustaTamanho:function(slider){
		let pre=$(slider).find('.sliderPreCorpo');
		if(pre.length){
			let corpo=$(slider).find('.sliderCorpo');
			let i=$(slider).find('.sliderItem');
			let w=i.outerWidth(true);
			let sw=pre.outerWidth(true);
			if(sw<w)i.css('width',sw+'px');
			if(pre[0].offsetWidth<corpo[0].offsetWidth)slider.find('.sliderBtn').css('opacity','');
			else slider.find('.sliderBtn').css('opacity','0');
		}
	}
}

//SLIDE SCROLL POSITION

//FORM
ifl1={};
const wfform={
	init:function(){
		$('form .input').on('focus, blur, keydown, change, select,textInput, input',e=>wfform.valida(e.target));
		$('form .input').blur(e=>wfform.blur(e.target));
		$('form .input').keydown(e=>wfform.keydown(e));
		$('form button.botao').click(e=>wfform.envia(e.target));
	},
	valida:i=>{
		const l=i.labels[0];
		let valido=false;
		//if(i.name=='nome')valido= /^\w\w+( \w\w+)+$/.test(ifl1.formatador.limpar(i.value));
		if(i.name=='nome')valido=ifl1.formatador.limpar(i.value).length>=3;
		else if(i.name=='celular'||i.name=='telefone')valido=/^\(?[1-9]{2}\)? ?(?:[2-8]|9[1-9])[0-9]{3}\-?[0-9]{4}$/.test(ifl1.formatador.soNumeros(i.value));
		else if(i.name=='email')valido=/^[^@ ]+@([^@ ]+[.][^@ ]+)+$/.test(ifl1.formatador.limpar(i.value));
		else if(i.name=='cpf')valido=ifl1.validador.validar.cpf(ifl1.formatador.soNumeros(i.value));
		else if(i.name=='cep')valido=ifl1.validador.validar.cep(ifl1.formatador.soNumeros(i.value));
		else if(i.name=='rg'||i.name=='cidade'||i.name=='bairro'||i.name=='logradouro')valido=ifl1.formatador.limpar(i.value).length>3;
		else if(i.name=='nascimento')valido=ifl1.formatador.soNumeros(i.value).length==8;
		else if(i.name=='sexo'||i.name=='uf')valido=i.value!=-1;
		else if(i.name=='numero')valido=ifl1.formatador.soNumeros(i.value)!="";
		else valido=true;
		if(valido){
			l.classList.add('valido');
			l.classList.remove('invalido');
			if(i.name=='celular'||i.name=='telefone')fetch('https://brasilapi.com.br/api/ddd/v1/'+ifl1.formatador.soNumeros(i.value).substr(0,2),{method:'GET',credentials:'omit',cache:'default'}).then(r=>r.json().then(json=>i.dataset.uf=json.state));
			else if(i.name=='cep')fetch('https://brasilapi.com.br/api/cep/v1/'+ifl1.formatador.soNumeros(i.value),{method:'GET',credentials:'omit',cache:'default'}).then(r=>r.json().then(json=>{
				if(json.hasOwnProperty('state')){
					wfform.valida($(i.form).find('.input[name="uf"]').val(json.state)[0]);
					wfform.valida($(i.form).find('.input[name="cidade"]').val(json.city)[0]);
					wfform.valida($(i.form).find('.input[name="bairro"]').val(json.neighborhood)[0]);
					wfform.valida($(i.form).find('.input[name="logradouro"]').val(json.street)[0]);
				}else{
					wfform.valida( $(i.form).find('.input[name="uf"]').val('')[0] );
					wfform.valida($(i.form).find('.input[name="cidade"]').val('')[0]);
					wfform.valida($(i.form).find('.input[name="bairro"]').val('')[0]);
					wfform.valida($(i.form).find('.input[name="logradouro"]').val('')[0]);
				}
			}));
		}else{
			l.classList.add('invalido');
			l.classList.remove('valido');
			if(i.name=='celular'||i.name=='telefone')delete(i.dataset.uf);
			else if(i.name=='cep'){
				wfform.valida( $(i.form).find('.input[name="uf"]').val('')[0] );
				wfform.valida($(i.form).find('.input[name="cidade"]').val('')[0]);
				wfform.valida($(i.form).find('.input[name="bairro"]').val('')[0]);
				wfform.valida($(i.form).find('.input[name="logradouro"]').val('')[0]);
			}
		}
	},
	blur:i=>{
		if(i.name=='cep'||i.name=='complemento')$(i.form).find('.input[name="complemento"]').parent().addClass('valido');
		if(i.labels[0].classList.contains('valido')){
			if(i.name=='nome'||i.name=='logradouro'||i.name=='bairro'||i.name=='cidade')i.value=ifl1.formatador.digitado.nome(ifl1.formatador.limpar(i.value));
			else if(i.name=='celular'||i.name=='telefone')i.value=ifl1.formatador.digitado.telefone(ifl1.formatador.soNumeros(i.value));
			else if(i.name=='cpf')i.value=ifl1.formatador.digitado.cpf(ifl1.formatador.soNumeros(i.value));
			else if(i.name=='cep')i.value=ifl1.formatador.digitado.cep(ifl1.formatador.soNumeros(i.value));
			else i.value=ifl1.formatador.limpar(i.value);
		}
	},
	keydown:e=>{
		const n=e.target.labels[0].nextElementSibling;
		if(e.keyCode==13){
			e.preventDefault();
			if(n.nodeName=="LABEL")n.focus();
			else if(n.nodeName=="BUTTON")n.click();
			return false;
		}
	},
	envia:btn=>{
		btn.disabled=true;
		if($(btn.form).find('.valido').length<$(btn.form).find('label').length){
			let aviso=$(btn.form).find('.aviso').first();
			aviso.html("Um ou mais campos não está preenchidos corretamente.");
			aviso.addClass('exibe');
			setTimeout(()=>aviso.removeClass('exibe'),3000);
			$(btn.form).find('label:not(.valido)').first().focus();
			$(btn.form).find('.invalido').first().focus();
			btn.disabled=false;
		}else{
			let dados={formulario:btn.form.dataset.formulario};
			$(btn.form).find('.input').each((k,i)=>{
				if(i.name=='celular'||i.name=='telefone'){
					dados[i.name]=ifl1.formatador.soNumeros(i.value);
					dados[i.name+'UF']=i.dataset.uf;
				}else if(i.name=='cpf'||i.name=='cep')dados[i.name]=ifl1.formatador.soNumeros(i.value);
				else dados[i.name]=i.value;
			});
			const opt={
				redirect:'follow',
				method:'POST',
				credentials:'include',
				headers:{'Content-Type':'application/json'},
				body:JSON.stringify(dados),
				cache:'no-cache'
			};
			fetch('/_ajax.php?cadastro',opt).then(r=>r.json().then(json=>{
				btn.disabled=false;
				//alert(json.msg);
				if(!dados.formulario||dados.formulario=='Cabeçalho - Plano Anual'){
					let aviso=$(btn.form).find('.aviso').first();
					aviso.html(json.msg);
					aviso.addClass('exibe');
					setTimeout(()=>aviso.removeClass('exibe'),10000);
				}else $(btn).closest('.form').addClass('msg').find('h2').html(json.msg);
				if(json.sucesso){
					btn.form.reset();
					$(btn.form).find('.valido,.invalido').removeClass('valido invalido');
					window.location.href="/cadastro-concluido";
				};
			}));
		}
	}
}
wfform.init();