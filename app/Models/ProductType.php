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

namespace App\Models;

use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * App\Models\ProductType
 *
 * @property int $id
 * @property int|null $user_id
 * @property int|null $company_id
 * @property string $name
 * @property bool $is_custom
 * @property bool $is_active
 * @property string|null $unit_of_measure
 * @property bool|null $serial_number
 * @property int|null $allocation_type
 * @property number|null $allocation_aggregation_interval
 * @property number|null $allocation_max_quantity
 * @property bool $is_deleted
 * @property bool $is_template
 * @property int|null $created_at
 * @property int|null $updated_at
 * @property int|null $deleted_at
 * @property-read \App\Models\Company|null $company
 * @property-read string $hashed_id
 * @method static \Illuminate\Database\Eloquent\Builder|BaseModel company()
 * @method static \Illuminate\Database\Eloquent\Builder|BaseModel exclude($columns)
 * @method static \Illuminate\Database\Eloquent\Builder|ProductType filter(\App\Filters\QueryFilters $filters)
 * @method static \Illuminate\Database\Eloquent\Builder|ProductType newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ProductType newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|ProductType onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ProductType query()
 * @method static \Illuminate\Database\Eloquent\Builder|BaseModel scope()
 * @method static \Illuminate\Database\Eloquent\Builder|ProductType whereCompanyId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ProductType whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ProductType whereDeletedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ProductType whereProductType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ProductType whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ProductType whereIsActive($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ProductType whereIsCustom($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ProductType whereIsDeleted($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ProductType whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ProductType whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ProductType whereUserId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|ProductType withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder|ProductType withoutTrashed()
 * @mixin \Eloquent
 */
class ProductType extends BaseModel
{
    use Filterable;
    use SoftDeletes;

    public const ALLOCATION_TYPE_QUANTITY_BASED = 1;
    public const ALLOCATION_TYPE_DATETIME_BASED = 2; // TODO: will be aggregated to quantity when finished

    protected $casts = [
        'deleted_at' => 'timestamp',
        'updated_at' => 'timestamp',
        'created_at' => 'timestamp',
    ];

    protected $fillable = [
        'name',
        'is_active',
        'unit_of_measure',
        'allocation_type',
        'serial_number_required',
        'allocation_type',
        'allocation_aggregation_interval',
        'allocation_max_quantity',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }
}
