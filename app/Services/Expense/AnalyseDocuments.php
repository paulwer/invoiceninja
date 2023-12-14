<?php
/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2023. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

namespace App\Services\Invoice;

use App\Models\Client;
use App\Models\Expense;
use App\Services\AbstractService;

class MarkSent extends AbstractService
{
    public function __construct(public Client $client, public Expense $expense)
    {
    }

    public function run($fire_webhook = false)
    {

    }
}
