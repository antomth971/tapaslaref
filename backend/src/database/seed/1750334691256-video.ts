// src/database/seeds/Video1750334691256.ts
import { AppDataSource } from '../../data-source';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { Video } from '../entity/video.entity';

const videos = [
	{
		"url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236403/Franc%CC%A7ois_Cluzet_Ce_sont_des_cons_-_En_Aparte%CC%81_sytr9k.mp4",
		"public_id": "François_Cluzet_Ce_sont_des_cons_-_En_Aparté_sytr9k",
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
		"public_id": "téléchaaarge_krcrex",
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
		"url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236392/Tu_pre%CC%81fe%CC%80res_moi_ou_ta_me%CC%80re_qpyibw.mp4",
		"public_id": "Tu_préfères_moi_ou_ta_mère_qpyibw",
		"format": "mp4",
		"resource_type": "video",
		"duration": 15.766349
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
		"public_id": "Thaïs_café_oqmfnf",
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
		"url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236390/soumis_rf7oac.mp4",
		"public_id": "soumis_rf7oac",
		"format": "mp4",
		"resource_type": "video",
		"duration": 24.170726
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
		"url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236385/marteau_rnxjcp.mp4",
		"public_id": "marteau_rnxjcp",
		"format": "mp4",
		"resource_type": "video",
		"duration": 4.458231
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
		"public_id": "le_crane_dégarnie_y6irns",
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
		"public_id": "la_vie_est_chère_bpeokb",
		"format": "mp4",
		"resource_type": "video",
		"duration": 15.800651
	},
	{
		"url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236382/la_vie_c_est_c%CC%A7a_tarek_bwhlwy.mp4",
		"public_id": "la_vie_c_est_ça_tarek_bwhlwy",
		"format": "mp4",
		"resource_type": "video",
		"duration": 9.729161
	},
	{
		"url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236382/kanye_je_ne_dirai_rien_d3lgls.mp4",
		"public_id": "kanye_je_ne_dirai_rien_d3lgls",
		"format": "mp4",
		"resource_type": "video",
		"duration": 22.314376
	},
	{
		"url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236382/je_ne_savais_pas_lvwwhd.mp4",
		"public_id": "je_ne_savais_pas_lvwwhd",
		"format": "mp4",
		"resource_type": "video",
		"duration": 44.489433
	},
	{
		"url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236382/la_puissance_bun7kf.mp4",
		"public_id": "la_puissance_bun7kf",
		"format": "mp4",
		"resource_type": "video",
		"duration": 13.165737
	},
	{
		"url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236381/je_suis_franc%CC%A7ais_uws8by.mp4",
		"public_id": "je_suis_français_uws8by",
		"format": "mp4",
		"resource_type": "video",
		"duration": 7.566667
	},
	{
		"url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236380/It_is_what_it_is_Meme_official_full_video_r9etcp.mp4",
		"public_id": "It_is_what_it_is_Meme_official_full_video_r9etcp",
		"format": "mp4",
		"resource_type": "video",
		"duration": 9.125442
	},
	{
		"url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236380/jdg_c_est_bien_du_coup_jh9gvm.mp4",
		"public_id": "jdg_c_est_bien_du_coup_jh9gvm",
		"format": "mp4",
		"resource_type": "video",
		"duration": 12.353016
	},
	{
		"url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236380/je_le_ferai_fqjgao.mp4",
		"public_id": "je_le_ferai_fqjgao",
		"format": "mp4",
		"resource_type": "video",
		"duration": 4.885333
	},
	{
		"url": "https://res.cloudinary.com/dxcglrick/video/upload/v1752236380/jaden_crying_ujkzwm.mp4",
		"public_id": "jaden_crying_ujkzwm",
		"format": "mp4",
		"resource_type": "video",
		"duration": 5.24069
	}
];

export class Video1750334691256 implements Seeder {
  track = false;

  public async run(dataSource: typeof AppDataSource, _factoryManager: SeederFactoryManager): Promise<void> {
    console.log('Seeding Video...');
    const videoRepo = dataSource.getRepository(Video);

    for (const item of videos) {
      const video = videoRepo.create({
        title: item.public_id,
        link: item.url,
        description: `Description de ${item.public_id}`,
        transcription: '',
        score: Math.floor(Math.random() * 10),
        format: item.format,
        duration: item.duration,
        publicId: item.public_id,
        user: null,
      });

      await videoRepo.save(video);
    }

    console.log('✅ Seed vidéo terminé !');
  }
}
