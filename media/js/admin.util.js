(function(window, $, Admin){
	
	if (!Admin) return;
	
	var cons = Admin.cons;
	
	// Build the interface on an element
	Admin.util.ui = function(selector){
	
		var elem = $(selector);

		// Messages
		elem.find('#messages').children().length 
		
			&& $('#messages').bind('show', function(){
					$(this).fadeIn(1400);
				}).trigger('show');

		// Selectmenu
		elem.find('select').selectmenu();

		// Save Button
		elem.find('.ui-button.save')
			.button({
				icons: { primary: "ui-icon-disk" }
			});

		// Default Button
		elem.find('.ui-button.default').button();

		// Tabs
		elem.find('.tabs').tabs();
	
		// Datepicker
	
		elem.find('.datepicker').datepicker();

		// Tree node expand/collapse
		function setTreeCookie(event){

			var id = $(this).data('id'), 
				name = (Admin.config.route.controller + '/' + Admin.config.route.action),
				ids = Admin.util.cookie.get(name);
			
			if (!id) return;

			ids = (ids)
				? ids.split(',')
				: [];
			
			if (event.type == 'expand') {

				if ( $.inArray( id.toString(), ids ) !== -1 ){
					return;
				}
				ids.push(id.toString());				
							
			} else if (event.type == 'collapse') {
			
				for (var i in ids) {					
					( ids[i] == id ) && ids.splice( i, 1 );
				}
			}
			Admin.util.cookie.set(name, ids.join(','));
		}
	
		elem.find('.ui-tree ul:first').tree({
			onExpand: setTreeCookie,
			onCollapse: setTreeCookie
		})
		// expand the open tree nodes
		.find('.tree-open').trigger('expand', [0]);
	
		// Button Menu
		elem.find('.action-menu button').button({
			icons: {
				primary: "ui-icon-gear",
				secondary: "ui-icon-triangle-1-s"
			}
		})
		.each(function() {

			$(this).next()
				.menu({
					select: function(event, ui) {
						$(this).hide();
						if (ui.item) { window.location = ui.item.find('a').attr('href'); }
					},
					input: $(this)
				}).hide();
		})
		.click(function(event) {

			var btn = this;

			$(this)
				.trigger('mousedown.button')
				.bind('mouseleave.admin.button', function(){
					$(this).addClass('ui-state-active');
				});

			var menu = $(this).next();

			if (menu.is(":visible")) {
				menu.hide();
				return false;
			}

			menu
				.menu("deactivate")
				.show()
				.css({top:0, left:0})
				.position({
					my: "left top",
					at: "left bottom",
					of: this
				});

			$(document).one("click", function() {
				menu.hide();
				$(btn).removeClass('ui-state-active').unbind('mouseleave.admin.button');
			});

			return false;
		});
	};

	Admin.util.trigger = function(scope, callback, arg){

		var type = typeof callback;
	
		arg = arg || [];
	
		( type === 'function' ) && callback.apply( scope, arg );
	};

	Admin.util.ajax = {
	
		loader : function(action){
		
			var method;
			switch(action){
				case cons.END:
				case cons.RESET:
					method = 'fadeOut';
					break;
				default:
					method = 'fadeIn';
			}
	
			$('#ajax-loading img')[method]('fast');
		}
	};

	Admin.util.validate = function(o){
	
		o = $.extend({
			formSelector: '.ajax-validate',
			redirect_url: null
		}, o);
	
		function postSuccess(data, form){
		
			var o = $.data(form, 'config');
		
			Admin.util.ajax.loader(END);

			$('.form-error, .label-error').hide();
		
			if (data.status) {

				var url = o.redirect_url || data.redirect_url;
				if (url) { window.location = url; }
			
			} else if (!data.status && data.errors){
			
				Admin.util.message('error', 'Please correct the errors.');

				var c = 0;
				$.each(data.errors, function(key, val){
				
					var input	= $('[name="' + key + '"]'),
						id		= input.attr('id'),
						label	= $('label[for="' + id + '"]');
				
					!label.find('.label-error').length 
						&& label.append('<span class="label-error"></span>');
				
					label.find('.label-error').hide().html(val).fadeIn('slow');						
					(c === 0) && input.focus();
					c++;
				});
			
				Admin.util.smoothScroll({
					target: '#messages',
					direction: 'up'
				});				
			}
		}	

		$(o.formSelector)
			.each(function(){
			
				if ($.data(this, 'config')) {
				
					(o) && $.data(this, 'config', o);
				
					return true;
				}				
				$.data(this, 'config', o);
			
				$(this)
				.submit(function(e){
			
					e.preventDefault();
					Admin.util.ajax.loader(BEGIN);
					var form = this;

					$.ajax({
						type: 'POST',
						url: this.action + '?' + (new Date().getTime()),
						cache: false,
						data: $(this).serialize(),
						dataType: 'json',
						success: function(data){
					
							postSuccess.call(this, data, form);
						}
					});
				});
			});
	};

	Admin.util.smoothScroll = function(o){

		o = $.extend({
			selector: 'a[href*=#].smooth-scroll',		// anchor selector (selector string)
			target: false,								// target element node, if not using above selector (optional) (selector string)
			speed: 1000,								// scroll speed (integer)
			offset: 3,									// target element offset (integer)
			direction: 'both'							// possible scroll direction (both; up or down)
		}, o);
	
		function isInternalAnchor(){			
			return (
				location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && 
				location.hostname == this.hostname
			);
		}
	
		function scrollToTarget(){
		
			var 
				targetOffset = this.offset(), 
				scrollTop = $('html').scrollTop(),
				scrollVal = targetOffset.top - o.offset,
				canScroll = 
					( o.direction == 'both' ) 
					|| ( o.direction == 'down' && scrollVal > scrollTop ) 
					|| ( o.direction == 'up' && scrollVal < scrollTop )
				;
			
			(canScroll) && 
				$('html,body').animate({
					scrollTop: scrollVal
				}, o.speed);
		}
	
		function init(){
		
			$(o.selector).each(function(){
			
				var anchor = $(this);
			
				anchor
					.bind('click.smooth-scroll', function(e){
				
						// is it an internal page link?
						if ( isInternalAnchor.call(this) ) {
		
							var target = $(this.hash);
						
							target = target.length && target || $('[name=' + this.hash.slice(1) + ']');
		
							if (target.length) {
							
								e.preventDefault(); 
							
								scrollToTarget.call( target );
							}
						}
					});
			});
		}
			
		(o.target) ? scrollToTarget.call( $(o.target) ) : init();
	};


	Admin.util.message = function(type, msg){
	
		var elem = $('#messages').empty().hide(), 
			item = '<li class="'+type+'">' + msg + '</li>';
	
		elem
			.append('<ul>' + item + '</ul>')
			.fadeIn('fast').effect("highlight", {}, 800);			
	}

	Admin.util.dialog = {
	
		confirm : function(msg, callback){
		
			if (confirm(msg)){
			
				this.trigger(callback);
			}
		},
		
		alert : function(title, msg, callback){

			$( "#messages" )
				.attr('title', title)
				.find('#messages-content')
				.html(msg)
				.end()
				.dialog({
					modal: true,
					resizable: false,
					height: 140,
					buttons: {
						Okay: function() {
						
							$(this).dialog("close");
						
							Admin.util.trigger(this, callback);
						}
					}
				});
		}
	};

	Admin.util.cookie = {

		config : {
			expiredays: 1,
			path: '/',
			name: 'admin'
		},

		_save : function(key, val, expiredays){
		
			expiredays = expiredays || this.config.expiredays || null;

			var expiredate = new Date();

			expiredate.setDate(expiredate.getDate() + expiredays);
		
			var data = this.get();
		
			data = (data) ? JSON.parse(data) :  {};
			data[key] = val;
			data = escape(JSON.stringify(data));
		
			document.cookie = 
				this.config.name + '=' 
				+ data
				+ ((expiredays === null) 
						? '' 
						: ';expires=' + expiredate.toGMTString()) 
				+ ';path=' + this.config.path;
		},

		get : function(key){

			if (!document.cookie.length) return;

			var start = document.cookie.indexOf(this.config.name + '=');

			if (start === -1) return '';

			start = start + this.config.name.length + 1;

			var end = document.cookie.indexOf(';', start);

			if (end === -1) end = document.cookie.length;

			var data = unescape(document.cookie.substring(start, end));
		
			return key ? data[key] : data;			
		},

		set : function(key, val, expiredays){

			this._save(key, val, expiredays);
		}
	};

	Admin.util.events = {

		callbacks : {},

		register : function(eventname, namespace, vars){

			namespace = namespace || 'default';
			vars = vars || {};

			var self = this;

			(this.callbacks[eventname] && this.callbacks[eventname][namespace]) &&

				$.each(this.callbacks[eventname][namespace], function(i){
				
					(this.callback && this.callback.constructor == Function) && this.callback(vars);

					(this.fireonce) && delete self.callbacks[eventname][namespace][i];
				});
		}
	};

	Admin.util.hooks = {

		register : function(eventname, namespace, callback, fireonce) {

			namespace = namespace || 'default';
			fireonce = fireonce || false;

			if (!$.sledge.events.callbacks[eventname]) {

				Admin.util.events.callbacks[eventname] = [];

				Admin.util.events.callbacks[eventname][namespace] = [];
			}

			Admin.util.events.callbacks[eventname][namespace].push({
				callback: callback,
				fireonce: fireonce
			});
		}
	};
	
	$.fn.ui = function(){
	
		return this.each(function(){
		
			Admin.util.ui(this);
		})
	};

	$.fn.smoothScroll = function(){

		return this.each(function(){
	
			Admin.util.smoothScroll({
				target: this
			});
		});
	};

})(this, this.jQuery, this.Admin);