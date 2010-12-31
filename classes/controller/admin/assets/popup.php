<?php defined('SYSPATH') or die('No direct script access.');

class Controller_Admin_Assets_Popup extends Controller_Admin_Assets {
	
	public $crud_model = 'assets';
	
	public $template = 'admin/page/assets_popup/master_page';

	public function action_index()
	{		
		$this->template->title = 'Assets';
				
		// Bind useful data objects to the view
		$this->template->content = View::factory('admin/page/assets_popup/index')
			->bind('assets', $assets)
			->bind('total', $total)
			->bind('page_links', $page_links)
			->bind('browse_html', $browse_html)
			->bind('upload_html', $upload_html);

		$browse_html = View::factory('admin/page/assets_popup/browse')
			->bind('assets', $assets);

		$upload_html = Request::factory('admin/assets/popup/upload')->execute()->response; 		

		// Get the total amount of items in the table
		$total = ORM::factory('asset')->count_all();

		// Generate the pagination values
		$pagination = Pagination::factory(array(
			'total_items' => $total,
			'items_per_page' => 18
		));

		// Get the items
		$assets = ORM::factory('asset')
			->limit($pagination->items_per_page)
			->offset($pagination->offset)
			->order_by('date', 'DESC')
			->find_all();

		// Generate the pagination links
		$page_links = $pagination->render();
		
		array_push($this->template->scripts, 'modules/admin/media/js/jquery.uploadify.min.js');
		array_push($this->template->scripts, 'modules/admin/media/js/jquery.multifile.pack.js');

	}

} // End Controller_Admin_Assets_Popup