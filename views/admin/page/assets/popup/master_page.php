<!doctype html>
<html lang="en" class="no-js admin <?php echo Kohana::$environment?> assetmanager popup" dir="ltr">
<head>
	<meta charset="utf-8" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<title><?php echo $title ?></title>
	<?php echo implode("\n\t", array_map('HTML::style', $styles)), "\n";?>
	<?php echo implode("\n\t", array_map('HTML::script', $scripts)), "\n" ?>
	<?php echo View::factory('page/fragments/analytics'), "\n"?>
</head>
	<!--[if lt IE 7 ]> <body class="ie6"> <![endif]-->
	<!--[if IE 7 ]>    <body class="ie7"> <![endif]-->
	<!--[if IE 8 ]>    <body class="ie8"> <![endif]-->
	<!--[if IE 9 ]>    <body class="ie9"> <![endif]-->
	<!--[if (gt IE 9)|!(IE)]><!--> <body> <!--<![endif]-->
	<div id="content">	
		<?php echo Message::render() ?>

		<?php echo $content ?>
	</div>
	<?php if (Kohana::$environment === Kohana::DEVELOPMENT){?>
		<div class="benchmark"> {execution_time} - {memory_usage} </div>
	<?php } else {?>
		<!-- {execution_time} - {memory_usage} -->
	<?php }?>
</body>
</html>
