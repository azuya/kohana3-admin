<h1>Add user</h1>

<?php echo Form::open()?>
	<fieldset>
		
		<div class="field">
			<?php echo 
				Form::label('username', __('Username'), NULL, $errors),
				Form::input('username',	$_POST['username'], NULL, $errors)
			?>
		</div>
		<div class="field">
			<?php echo 
				Form::label('email', __('Email'), NULL, $errors),
				Form::input('email', $_POST['email'], array('type' => 'email'), $errors)
			?>
		</div>
		<div class="field">
			<?php echo
				Form::label('roles', __('Roles'))
			?>
			<?php foreach($roles as $role){?>
			<div class="checkbox">
				<?php echo 
					Form::checkbox('roles[]', $role->id, FALSE, array('id' => 'role-'.$role->id)),
					Form::label('role-'.$role->id, $role->name)
				?>
			</div>
			<?php }?>
		</div>
		<div class="field">
			<?php echo 
				Form::label('password', __('New password'), NULL, $errors),
				Form::password('password', NULL, NULL, $errors)
			?>
		</div>
		<div class="field">
			<?php echo 
				Form::label('password_confirm', __('Confirm password'), NULL, $errors),
				Form::password('password_confirm', NULL, NULL, $errors)
			?>
		</div>

		<?php echo Form::submit('save', 'Save', array('class' => 'button'))?>
	</fieldset>
<?php echo Form::close()?>