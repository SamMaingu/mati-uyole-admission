<?php

namespace Database\Seeders;

use App\Models\District;
use App\Models\Region;
use Illuminate\Database\Seeder;

class TanzaniaDataSeeder extends Seeder
{
    public function run(): void
    {
        $data = [
            'Arusha' => [
                'Arusha City', 'Arusha DC', 'Karatu', 'Longido', 'Meru', 'Monduli', 'Ngorongoro',
            ],
            'Dar es Salaam' => [
                'Ilala', 'Kinondoni', 'Temeke', 'Ubungo', 'Kigamboni',
            ],
            'Dodoma' => [
                'Dodoma City', 'Bahi', 'Chamwino', 'Chemba', 'Kondoa', 'Kongwa', 'Mpwapwa',
            ],
            'Geita' => [
                'Bukombe', 'Chato', 'Geita DC', 'Geita Town', 'Mbogwe', "Nyang'hwale",
            ],
            'Iringa' => [
                'Iringa MC', 'Iringa DC', 'Kilolo', 'Mafinga Town', 'Mufindi',
            ],
            'Kagera' => [
                'Biharamulo', 'Bukoba DC', 'Bukoba MC', 'Karagwe', 'Kyerwa', 'Missenyi', 'Muleba', 'Ngara',
            ],
            'Katavi' => [
                'Mlele', 'Moba', 'Mpanda DC', 'Mpanda Town', 'Nsimbo', 'Tanganyika',
            ],
            'Kigoma' => [
                'Buhigwe', 'Kakonko', 'Kasulu DC', 'Kasulu Town', 'Kibondo', 'Kigoma DC', 'Kigoma Ujiji', 'Uvinza',
            ],
            'Kilimanjaro' => [
                'Hai', 'Moshi DC', 'Moshi MC', 'Mwanga', 'Rombo', 'Same', 'Siha',
            ],
            'Lindi' => [
                'Kilwa', 'Lindi DC', 'Lindi MC', 'Liwale', 'Nachingwea', 'Ruangwa',
            ],
            'Manyara' => [
                'Babati DC', 'Babati Town', 'Hanang', 'Kiteto', 'Mbulu', 'Simanjiro',
            ],
            'Mara' => [
                'Bunda', 'Butiama', 'Musoma DC', 'Musoma MC', 'Rorya', 'Serengeti', 'Tarime DC', 'Tarime Town',
            ],
            'Mbeya' => [
                'Busokelo', 'Chunya', 'Ileje', 'Kyela', 'Mbarali', 'Mbeya CC', 'Mbeya DC', 'Rungwe',
            ],
            'Morogoro' => [
                'Gairo', 'Ifakara Town', 'Kilombero', 'Kilosa', 'Malinyi', 'Morogoro DC', 'Morogoro MC', 'Mvomero', 'Ulanga',
            ],
            'Mtwara' => [
                'Masasi DC', 'Masasi Town', 'Mtwara DC', 'Mtwara MC', 'Nanyamba Town', 'Newala DC', 'Newala Town', 'Tandahimba',
            ],
            'Mwanza' => [
                'Buchosa', 'Ilemela', 'Kwimba', 'Magu', 'Misungwi', 'Mwanza CC', 'Sengerema', 'Ukerewe',
            ],
            'Njombe' => [
                'Ludewa', 'Makambako Town', 'Makete', 'Njombe DC', 'Njombe Town', "Wanging'ombe",
            ],
            'Pwani' => [
                'Bagamoyo', 'Chalinze', 'Kibaha DC', 'Kibaha Town', 'Kibiti', 'Kisarawe', 'Mafia', 'Mkuranga', 'Rufiji',
            ],
            'Rukwa' => [
                'Kalambo', 'Nkasi', 'Sumbawanga DC', 'Sumbawanga MC',
            ],
            'Ruvuma' => [
                'Madaba', 'Mbinga DC', 'Mbinga Town', 'Namtumbo', 'Nyasa', 'Songea DC', 'Songea MC', 'Tunduru',
            ],
            'Shinyanga' => [
                'Kahama DC', 'Kahama Town', 'Kishapu', 'Msalala', 'Shinyanga DC', 'Shinyanga MC', 'Ushetu',
            ],
            'Simiyu' => [
                'Bariadi DC', 'Bariadi Town', 'Busega', 'Itilima', 'Maswa', 'Meatu',
            ],
            'Singida' => [
                'Ikungi', 'Iramba', 'Itigi', 'Manyoni', 'Mkalama', 'Singida DC', 'Singida MC',
            ],
            'Songwe' => [
                'Mbozi', 'Momba', 'Songwe', 'Tunduma',
            ],
            'Tabora' => [
                'Igunga', 'Kaliua', 'Nzega DC', 'Nzega Town', 'Sikonge', 'Tabora DC', 'Tabora MC', 'Urambo', 'Uyui',
            ],
            'Tanga' => [
                'Handeni DC', 'Handeni Town', 'Kilindi', 'Korogwe DC', 'Korogwe Town', 'Lushoto', 'Mkinga', 'Muheza', 'Pangani', 'Tanga CC',
            ],
            'Kaskazini Pemba' => [
                'Micheweni', 'Wete',
            ],
            'Kaskazini Unguja' => [
                'Kaskazini A', 'Kaskazini B',
            ],
            'Kusini Pemba' => [
                'Chake Chake', 'Mkoani',
            ],
            'Kusini Unguja' => [
                'Kati', 'Kusini',
            ],
            'Mjini Magharibi' => [
                'Magharibi', 'Mjini',
            ],
        ];

        foreach ($data as $regionName => $districtNames) {
            $region = Region::firstOrCreate(['name' => $regionName]);

            foreach ($districtNames as $districtName) {
                District::firstOrCreate(
                    ['region_id' => $region->id, 'name' => $districtName],
                );
            }
        }
    }
}