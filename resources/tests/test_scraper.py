#!/usr/bin/python
# -*- encoding: utf-8 -*-
import sys
import os
import unittest
import bs4

from resources.lib.dailytube4u.scraper import *

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '../..'))


# class TestScraper(unittest.TestCase):
#     PATH_TALKSHOW = '/talkshows'
#     URL_QAHERA_AL_YAWM = 'http://www.dailytube4u.com/alqahera-alyoum/#catViewSubVideos'
#
#     def test_read_dailytube_homepage(self):
#         content = read_dailytube_homepage()
#         self.assertTrue(len(content) > 0, 'DailyTube4U.com homepage is up and running')
#
#     def test_channels(self):
#         channels = get_channels()
#         self.assertGreaterEqual(len(channels), 0, 'More than 0 channels are always returned')
#
#     def test_category_sub_categories(self):
#         sub_categories = get_sub_categories(self.PATH_TALKSHOW)
#         self.assertGreaterEqual(len(sub_categories), 10,
#                                 'At least more than 10 talkshow sub categories are always returned')


class TestSubCategoryParsing(unittest.TestCase):
    def test_parse_standard(self):
        sample_category = bs4.BeautifulSoup(
            u'<div class="videoBox"><div class="video-card"><a class="videothumblink" href="/alqahera-alyoum/"><div class="watermark_box"><img src="http://img.youtube.com/vi/aTY2pMiAIGE/hqdefault.jpg" alt="View Video" border="0" title="عمرو أديب حلقة السبت 2-8-2014 كاملة - ثورة الإنترنت تشكو سوء الخدمة" class="thumb0 "><span class="timestamp">1:49:54</span><span class="hoverplspn"></span></div></a><div class="video-data"><a class="categorylink" href="/alqahera-alyoum/">Alqahera Alyoum</a></div></div></div>')
        expected = SubCategory('Alqahera Alyoum', '/alqahera-alyoum/',
                               'http://img.youtube.com/vi/aTY2pMiAIGE/hqdefault.jpg')

        actual = parse_sub_category(sample_category)
        self.assertEqual(actual.title, expected.title, 'Sub category titles match')
        self.assertEqual(actual.path, expected.path, 'Sub category path match')
        self.assertEqual(actual.thumb, expected.thumb, 'Sub category thumb match')

    def test_parse_with_no_thumb(self):
        sample_category = bs4.BeautifulSoup(
            u'<div class="videoBox"><div class="video-card"><div class="video-data"><a class="categorylink" href="/talkshow/monaw3/">other shows</a></div></div></div>')
        expected = SubCategory('other shows', '/talkshow/monaw3/')

        actual = parse_sub_category(sample_category)
        self.assertEqual(actual.title, expected.title, 'Sub category titles match')
        self.assertEqual(actual.path, expected.path, 'Sub category path match')
        self.assertEqual(actual.thumb, expected.thumb, 'Sub category has no thumb')

if __name__ == '__main__':
    unittest.main()