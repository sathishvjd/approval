<?php
/**
 * Nextcloud - Approval
 *
 * This file is licensed under the Affero General Public License version 3 or
 * later. See the COPYING file.
 *
 * @author Julien Veyssier <eneiluj@posteo.net>
 * @copyright Julien Veyssier 2021
 */

namespace OCA\Approval\Controller;

use OCP\App\IAppManager;
use OCP\AppFramework\Http\DataDisplayResponse;

use OCP\IURLGenerator;
use OCP\IConfig;
use OCP\IL10N;

use OCP\AppFramework\Http;
use OCP\AppFramework\Http\RedirectResponse;

use OCP\AppFramework\Http\ContentSecurityPolicy;

use Psr\Log\LoggerInterface;
use OCP\IRequest;
use OCP\AppFramework\Http\DataResponse;
use OCP\AppFramework\Controller;

use OCA\Approval\Service\ApprovalService;
use OCA\Approval\AppInfo\Application;

class ApprovalController extends Controller {

	private $userId;
	private $config;
	private $dbconnection;
	private $dbtype;

	public function __construct($AppName,
								IRequest $request,
								IConfig $config,
								IL10N $l10n,
								IAppManager $appManager,
								LoggerInterface $logger,
								ApprovalService $approvalService,
								?string $userId) {
		parent::__construct($AppName, $request);
		$this->userId = $userId;
		$this->l10n = $l10n;
		$this->config = $config;
		$this->logger = $logger;
		$this->approvalService = $approvalService;
		$this->approvableTag = $this->config->getAppValue(Application::APP_ID, 'approvable_tag', 'approvable');
	}

	/**
	 * get file tags
	 * @NoAdminRequired
	 * @NoCSRFRequired
	 *
	 * @param int $fileId
	 * @return DataDisplayResponse
	 */
	public function getTags(int $fileId): DataDisplayResponse {
		$tags = $this->approvalService->getTags($fileId);
		return new DataDisplayResponse($tags);
	}
}
