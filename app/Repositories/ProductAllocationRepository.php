<?php
/**
 * Invoice Ninja (https://invoiceninja.com).
 *
 * @link https://github.com/invoiceninja/invoiceninja source repository
 *
 * @copyright Copyright (c) 2024. Invoice Ninja LLC (https://invoiceninja.com)
 *
 * @license https://www.elastic.co/licensing/elastic-license
 */

namespace App\Repositories;

use App\Factory\ProductAllocationFactory;
use App\Models\Invoice;
use App\Models\ProductAllocation;
use App\Utils\Traits\SavesDocuments;
use Illuminate\Support\Carbon;

class ProductAllocationRepository extends BaseRepository
{
    use SavesDocuments;

    /**
     * @param array $data
     * @param ProductAllocation $productAllocation
     * @return ProductAllocation|null
     */
    public function create(string $company_id, string $user_id, string $product_id, array $data): ?ProductAllocation
    {

        /** @var ProductAllocation $productAllocation */
        $productAllocation;

        // aggregation of entries for products, which are likly not equipments and not assigned to an invoice
        if (!empty($data['aggregation_key']) && empty($data['invoice_id']) && empty($data['serial_number'])) {

            // find unique entry
            $query = ProductAllocation::where('aggregation_key', $data['aggregation_key'])
                ->where('company_id', $company_id)
                ->where('user_id', $user_id)
                ->where('product_id', $product_id)
                ->where('client_id', $data['client_id'] ?? null)
                ->where('project_id', $data['project_id'] ?? null)
                ->where('invoice_id', null)
                ->where('recurring_id', $data['recurring_id'] ?? null)
                ->where('subscription_id', $data['subscription_id'] ?? null);

            // custom queries for aggregationKey useable with custom time frames
            if (!empty($data['aggregation_intervall'])) {

                if ($data['aggregation_intervall'] === 'hourly') {
                    $query = $query->where('created_at', '>=', Carbon::now()->subHour());
                } else if ($data['aggregation_intervall'] === 'daily') {
                    $query = $query->where('created_at', '>=', Carbon::now()->subDay());
                } else if ($data['aggregation_intervall'] === 'weekly') {
                    $query = $query->whereBetween('created_at', [
                        Carbon::now()->startOfWeek(Carbon::MONDAY),
                        Carbon::now()->endOfWeek(Carbon::SUNDAY)
                    ]);
                } else if ($data['aggregation_intervall'] === 'monthly') {
                    $query = $query->whereYear('created_at', '=', Carbon::now()->year)
                        ->whereMonth('created_at', '=', Carbon::now()->month);
                } else if ($data['aggregation_intervall'] === 'yearly') {
                    $query = $query->whereYear('created_at', '=', Carbon::now()->year);
                } else if (Carbon::hasFormat(Carbon::now(), $data['aggregation_key'])) {                 // For unsupported or custom time frame formats
                    $query = $query->whereDate('created_at', '>', Carbon::now()->format($data['aggregation_key']));
                }
            }

            // fetch data
            $productAllocation = $query->orderBy('created_at', 'desc')->first();

            // checks and modifications to input data
            if (!empty($productAllocation)) {
                // check if its even allowed to aggregate this data
                if (!empty($productAllocation->invoice_id) && $productAllocation->invoice()->status != Invoice::STATUS_DRAFT)
                    throw new \Exception('Invoice already sent. Cannot aggregate.');

                // increment quantity to allow aggregating from original input
                if (!empty($data['quantity']))
                    $data['quantity'] += $productAllocation->quantity;
            }
        }

        // create new entry, when we were not able to fetch an existing one
        if (empty($productAllocation))
            $productAllocation = ProductAllocationFactory::create($company_id, $user_id, $product_id);

        return $this->save($data, $productAllocation);
    }

    /**
     * @param array $data
     * @param ProductAllocation $productAllocation
     * @return ProductAllocation|null
     */
    public function save(array $data, ProductAllocation $productAllocation): ?ProductAllocation
    {
        $productAllocation->fill($data);
        $productAllocation->save();

        if (array_key_exists('documents', $data)) {
            $this->saveDocuments($data['documents'], $productAllocation);
        }

        return $productAllocation;
    }
}
