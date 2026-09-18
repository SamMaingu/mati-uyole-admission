<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\District;
use App\Models\Region;
use Illuminate\Http\JsonResponse;

class RegionController extends Controller
{
    public function index(): JsonResponse
    {
        $regions = Region::orderBy('name')->get(['id', 'name']);

        return response()->json(['regions' => $regions]);
    }

    public function districts(Region $region): JsonResponse
    {
        $districts = District::where('region_id', $region->id)
            ->orderBy('name')
            ->get(['id', 'name']);

        return response()->json(['districts' => $districts]);
    }
}