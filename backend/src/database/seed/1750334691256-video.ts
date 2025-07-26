// src/database/seeds/Video1750334691256.ts
import { AppDataSource } from '../../data-source';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Video } from '../entity/video.entity';

const videos = [
    {
        "url": "https://res.cloudinary.com/dxcglrick/image/upload/v1752493611/1F57944C-B5C4-4926-B32B-3D23DC51EBBE_1_105_c_ruapin.jpg",
        "public_id": "1F57944C-B5C4-4926-B32B-3D23DC51EBBE_1_105_c_ruapin",
        "format": "jpg",
        "resource_type": "image",
        "duration": null
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/image/upload/v1752493611/052A2A2A-A0BA-44A4-8B2B-C2359A3233C0_1_201_a_dymgvi.jpg",
        "public_id": "052A2A2A-A0BA-44A4-8B2B-C2359A3233C0_1_201_a_dymgvi",
        "format": "jpg",
        "resource_type": "image",
        "duration": null
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/image/upload/v1752493611/0A2716AE-61EE-4702-86D1-84FC33167F23_wda59i.jpg",
        "public_id": "0A2716AE-61EE-4702-86D1-84FC33167F23_wda59i",
        "format": "jpg",
        "resource_type": "image",
        "duration": null
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/image/upload/v1752493611/0172C8F6-3217-4774-BF3B-DB6C1FA85BAC_lrnws6.jpg",
        "public_id": "0172C8F6-3217-4774-BF3B-DB6C1FA85BAC_lrnws6",
        "format": "jpg",
        "resource_type": "image",
        "duration": null
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/image/upload/v1752493611/505D81CF-0996-48A1-9E2D-BFCD8C46C0B9_klg57i.jpg",
        "public_id": "505D81CF-0996-48A1-9E2D-BFCD8C46C0B9_klg57i",
        "format": "jpg",
        "resource_type": "image",
        "duration": null
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/image/upload/v1752493611/51ED9EE5-74F2-4206-A724-F33E187BD705_l2uczr.jpg",
        "public_id": "51ED9EE5-74F2-4206-A724-F33E187BD705_l2uczr",
        "format": "jpg",
        "resource_type": "image",
        "duration": null
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/image/upload/v1752493611/FC46B578-DD88-4E3C-B228-0D893B2B8A6F_4_5005_c_xxumfd.jpg",
        "public_id": "FC46B578-DD88-4E3C-B228-0D893B2B8A6F_4_5005_c_xxumfd",
        "format": "jpg",
        "resource_type": "image",
        "duration": null
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/image/upload/v1752493610/18AD9C9B-F26C-4795-8CFE-D6D7EE49F485_ushfo3.jpg",
        "public_id": "18AD9C9B-F26C-4795-8CFE-D6D7EE49F485_ushfo3",
        "format": "jpg",
        "resource_type": "image",
        "duration": null
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/image/upload/v1752493610/56061BE6-4BB2-4204-A66C-5C9C0324B547_1_105_c_cexsjm.jpg",
        "public_id": "56061BE6-4BB2-4204-A66C-5C9C0324B547_1_105_c_cexsjm",
        "format": "jpg",
        "resource_type": "image",
        "duration": null
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/image/upload/v1752493610/A5ADA990-A8F6-44FD-894D-A65A3D6469B1_4_5005_c_i7biha.jpg",
        "public_id": "A5ADA990-A8F6-44FD-894D-A65A3D6469B1_4_5005_c_i7biha",
        "format": "jpg",
        "resource_type": "image",
        "duration": null
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/image/upload/v1752493610/BC0726A0-A62C-4935-98E6-642236F383AC_4_5005_c_ghdzfx.jpg",
        "public_id": "BC0726A0-A62C-4935-98E6-642236F383AC_4_5005_c_ghdzfx",
        "format": "jpg",
        "resource_type": "image",
        "duration": null
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/image/upload/v1752493610/9592A404-E6CF-4FD8-9A81-7FCB9D67AE9A_4_5005_c_du92my.jpg",
        "public_id": "9592A404-E6CF-4FD8-9A81-7FCB9D67AE9A_4_5005_c_du92my",
        "format": "jpg",
        "resource_type": "image",
        "duration": null
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236403/Franc%CC%A7ois_Cluzet_Ce_sont_des_cons_-_En_Aparte%CC%81_sytr9k.mp4",
        "public_id": "François_Cluzet_Ce_sont_des_cons_-_En_Aparté_sytr9k",
        "format": "mp4",
        "resource_type": "video",
        "duration": 183.135782
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236397/vite_fait_rapidement_lynzxl.mp4",
        "public_id": "vite_fait_rapidement_lynzxl",
        "format": "mp4",
        "resource_type": "video",
        "duration": 59.209002
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236394/te%CC%81le%CC%81chaaarge_krcrex.mp4",
        "public_id": "téléchaaarge_krcrex",
        "format": "mp4",
        "resource_type": "video",
        "duration": 65.248073
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236394/Zepeck_Logobi_qmvcag.mp4",
        "public_id": "Zepeck_Logobi_qmvcag",
        "format": "mp4",
        "resource_type": "video",
        "duration": 103.2
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236394/ZERO_-_el_chiringuito_meme_pqfh7j.mp4",
        "public_id": "ZERO_-_el_chiringuito_meme_pqfh7j",
        "format": "mp4",
        "resource_type": "video",
        "duration": 11.331338
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236393/voix_grave_marine_gdvdpr.mp4",
        "public_id": "voix_grave_marine_gdvdpr",
        "format": "mp4",
        "resource_type": "video",
        "duration": 16.741587
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236392/vachement_cool_quoi_zn1oei.mp4",
        "public_id": "vachement_cool_quoi_zn1oei",
        "format": "mp4",
        "resource_type": "video",
        "duration": 20.130249
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236391/t_un_batar_lassana_eod318.mp4",
        "public_id": "t_un_batar_lassana_eod318",
        "format": "mp4",
        "resource_type": "video",
        "duration": 16.300408
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236391/Thai%CC%88s_cafe%CC%81_oqmfnf.mp4",
        "public_id": "Thaïs_café_oqmfnf",
        "format": "mp4",
        "resource_type": "video",
        "duration": 14.162721
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236390/superman_trauma_nc5h23.mp4",
        "public_id": "superman_trauma_nc5h23",
        "format": "mp4",
        "resource_type": "video",
        "duration": 9.241542
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236390/spiderman_vapor_kkyk4l.mp4",
        "public_id": "spiderman_vapor_kkyk4l",
        "format": "mp4",
        "resource_type": "video",
        "duration": 5.990748
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236389/sad_goku_win_j9blq9.mp4",
        "public_id": "sad_goku_win_j9blq9",
        "format": "mp4",
        "resource_type": "video",
        "duration": 7.407166
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236389/plan_de_la_street_jovbj0.mp4",
        "public_id": "plan_de_la_street_jovbj0",
        "format": "mp4",
        "resource_type": "video",
        "duration": 20.64254
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236389/sanji_qui_cuisine_kv5cyy.mp4",
        "public_id": "sanji_qui_cuisine_kv5cyy",
        "format": "mp4",
        "resource_type": "video",
        "duration": 6.818
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236389/pogba_toc_toc_toc_tqzozl.mp4",
        "public_id": "pogba_toc_toc_toc_tqzozl",
        "format": "mp4",
        "resource_type": "video",
        "duration": 9.520181
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236389/riche_scaface_csakpj.mp4",
        "public_id": "riche_scaface_csakpj",
        "format": "mp4",
        "resource_type": "video",
        "duration": 9.938141
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236389/perroquet_lnkxtz.mp4",
        "public_id": "perroquet_lnkxtz",
        "format": "mp4",
        "resource_type": "video",
        "duration": 7.103855
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236388/parce_que_je_suis_un_arabe__jsgdwl.mp4",
        "public_id": "parce_que_je_suis_un_arabe__jsgdwl",
        "format": "mp4",
        "resource_type": "video",
        "duration": 7.637914
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236388/Patrice_Quarteron_cest_mon_travail_h6ucij.mp4",
        "public_id": "Patrice_Quarteron_cest_mon_travail_h6ucij",
        "format": "mp4",
        "resource_type": "video",
        "duration": 6.710567
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236388/mc_jean_gabin_telecharge_cciags.mp4",
        "public_id": "mc_jean_gabin_telecharge_cciags",
        "format": "mp4",
        "resource_type": "video",
        "duration": 65.248073
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236388/Oppenhei_q7gr27.mp4",
        "public_id": "Oppenhei_q7gr27",
        "format": "mp4",
        "resource_type": "video",
        "duration": 18.876372
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236387/oran_outan_eqmcfh.mp4",
        "public_id": "oran_outan_eqmcfh",
        "format": "mp4",
        "resource_type": "video",
        "duration": 7.150295
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236387/one_piece_crying_c5fzbu.mp4",
        "public_id": "one_piece_crying_c5fzbu",
        "format": "mp4",
        "resource_type": "video",
        "duration": 39.797551
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236386/ohlala_la_tete_de_sa_mere_ptn_sqhxmo.mp4",
        "public_id": "ohlala_la_tete_de_sa_mere_ptn_sqhxmo",
        "format": "mp4",
        "resource_type": "video",
        "duration": 28.723084
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236386/non_j_ai_toujours_ete_frais_kn1hbn.mp4",
        "public_id": "non_j_ai_toujours_ete_frais_kn1hbn",
        "format": "mp4",
        "resource_type": "video",
        "duration": 12.027937
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236386/on_va_nous_payer_notre_argent_aujourd_hui_ka00rh.mp4",
        "public_id": "on_va_nous_payer_notre_argent_aujourd_hui_ka00rh",
        "format": "mp4",
        "resource_type": "video",
        "duration": 8.8
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236386/Naza_J_aimerais_dire_que_j_adore_mais_on_adore_que_DIEU_cbmiqz.mp4",
        "public_id": "Naza_J_aimerais_dire_que_j_adore_mais_on_adore_que_DIEU_cbmiqz",
        "format": "mp4",
        "resource_type": "video",
        "duration": 10.0078
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236386/ne_me_trahi_pas_mhobqh.mp4",
        "public_id": "ne_me_trahi_pas_mhobqh",
        "format": "mp4",
        "resource_type": "video",
        "duration": 14.814331
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236385/mj_reverse_scmuhu.mp4",
        "public_id": "mj_reverse_scmuhu",
        "format": "mp4",
        "resource_type": "video",
        "duration": 6.548027
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236385/magic_anniversaire_dqof2s.mp4",
        "public_id": "magic_anniversaire_dqof2s",
        "format": "mp4",
        "resource_type": "video",
        "duration": 30.139501
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236385/menotte_lh8rdx.mp4",
        "public_id": "menotte_lh8rdx",
        "format": "mp4",
        "resource_type": "video",
        "duration": 12.653424
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236385/mariokart_inhumain_pe0cqf.mp4",
        "public_id": "mariokart_inhumain_pe0cqf",
        "format": "mp4",
        "resource_type": "video",
        "duration": 18.567937
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236384/mais_apres_ca_va_chauffer_scpwo0.mp4",
        "public_id": "mais_apres_ca_va_chauffer_scpwo0",
        "format": "mp4",
        "resource_type": "video",
        "duration": 14.046009
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236384/mal_hayrvk.mp4",
        "public_id": "mal_hayrvk",
        "format": "mp4",
        "resource_type": "video",
        "duration": 6.780227
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236383/le_crane_de%CC%81garnie_y6irns.mp4",
        "public_id": "le_crane_dégarnie_y6irns",
        "format": "mp4",
        "resource_type": "video",
        "duration": 15.836009
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236383/ma_question_jplwqp.mp4",
        "public_id": "ma_question_jplwqp",
        "format": "mp4",
        "resource_type": "video",
        "duration": 17.089887
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236383/lent_rapide_kgjcx1.mp4",
        "public_id": "lent_rapide_kgjcx1",
        "format": "mp4",
        "resource_type": "video",
        "duration": 13.839093
    },
    {
        "url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236383/la_vie_est_che%CC%80re_bpeokb.mp4",
        "public_id": "la_vie_est_chère_bpeokb",
        "format": "mp4",
        "resource_type": "video",
        "duration": 15.800651
    }
];

export class Video1750334691256 implements Seeder {
  track = false;

  public async run(
    dataSource: typeof AppDataSource,
    _factoryManager: SeederFactoryManager,
  ): Promise<void> {
    console.log('Seeding Video...');
    const videoRepo = dataSource.getRepository(Video);

    for (const item of videos) {
      const video = videoRepo.create({
        title: item.public_id,
        link: item.url,
        description: `Description de ${item.public_id}`,
        transcription: '',
        score: Math.floor(Math.random() * 10),
        format: item.resource_type,
        duration: item.duration,
        publicId: item.public_id,
        user: null,
      });

      await videoRepo.save(video);
    }

    console.log('✅ Seed vidéo terminé !');
  }
}
