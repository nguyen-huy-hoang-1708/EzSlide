-- Update common English slide titles to Japanese
-- Run this SQL script to convert existing slide titles

-- Course/Education related titles
UPDATE Slide SET title = 'コース紹介' WHERE title LIKE '%Course Introduction%';
UPDATE Slide SET title = '学習内容' WHERE title LIKE '%What You Will Learn%' OR title LIKE '%What You%ll Learn%';
UPDATE Slide SET title = '前提条件' WHERE title LIKE '%Prerequisites%' OR title LIKE '%Prerequisite%';
UPDATE Slide SET title = 'フェーズ 1: フロントエンド基礎' WHERE title LIKE '%Phase 1%Frontend%';
UPDATE Slide SET title = 'フェーズ 2: モダンフロントエンド' WHERE title LIKE '%Phase 2%Frontend%' OR title LIKE '%Phase 2%Modern%';
UPDATE Slide SET title = 'フェーズ 3: バックエンド開発' WHERE title LIKE '%Phase 3%Backend%';
UPDATE Slide SET title = 'フェーズ 4: フルスタック統合' WHERE title LIKE '%Phase 4%Full%Stack%';

-- Common generic slide titles
UPDATE Slide SET title = '表紙' WHERE title = 'Cover Slide' OR title = 'Cover';
UPDATE Slide SET title = '問題点' WHERE title = 'The Problem' OR title = 'Problem';
UPDATE Slide SET title = '解決策' WHERE title = 'Our Solution' OR title = 'Solution';
UPDATE Slide SET title = '製品デモ' WHERE title = 'Product Demo' OR title = 'Demo';
UPDATE Slide SET title = '主要機能' WHERE title = 'Key Features' OR title = 'Features';
UPDATE Slide SET title = '市場機会' WHERE title = 'Market Opportunity' OR title = 'Market';
UPDATE Slide SET title = 'ビジネスモデル' WHERE title = 'Business Model';
UPDATE Slide SET title = '成長と実績' WHERE title LIKE '%Traction%Growth%' OR title = 'Growth';
UPDATE Slide SET title = 'チーム紹介' WHERE title = 'The Team' OR title = 'Team';
UPDATE Slide SET title = '投資依頼' WHERE title = 'Investment Ask' OR title = 'Investment';
UPDATE Slide SET title = 'まとめ' WHERE title = 'Conclusion' OR title = 'Summary';
UPDATE Slide SET title = 'Q&A' WHERE title = 'Questions' OR title = 'Q&A';

-- Generic numbered slides
UPDATE Slide SET title = CONCAT('スライド ', SUBSTRING(title, 7)) 
WHERE title REGEXP '^Slide [0-9]+$';

UPDATE Slide SET title = CONCAT('新しいスライド ', SUBSTRING(title, 11)) 
WHERE title REGEXP '^New Slide [0-9]*$';

UPDATE Slide SET title = '新しいスライド' 
WHERE title = 'New Slide';

-- Introduction related
UPDATE Slide SET title = 'はじめに' WHERE title = 'Introduction' OR title = 'Intro';
UPDATE Slide SET title = '概要' WHERE title = 'Overview';
UPDATE Slide SET title = '目次' WHERE title = 'Table of Contents' OR title = 'Contents' OR title = 'Agenda';
UPDATE Slide SET title = '目標' WHERE title = 'Goals' OR title = 'Objectives';
UPDATE Slide SET title = '背景' WHERE title = 'Background';

-- Project related
UPDATE Slide SET title = 'プロジェクト概要' WHERE title LIKE '%Project%Overview%';
UPDATE Slide SET title = 'プロジェクト計画' WHERE title LIKE '%Project%Plan%';
UPDATE Slide SET title = 'プロジェクトタイムライン' WHERE title LIKE '%Project%Timeline%' OR title = 'Timeline';
UPDATE Slide SET title = 'マイルストーン' WHERE title = 'Milestones' OR title = 'Milestone';

-- Results and metrics
UPDATE Slide SET title = '結果' WHERE title = 'Results';
UPDATE Slide SET title = 'メトリクス' WHERE title = 'Metrics';
UPDATE Slide SET title = '分析' WHERE title = 'Analysis';
UPDATE Slide SET title = 'データ' WHERE title = 'Data';

-- Call to action
UPDATE Slide SET title = '次のステップ' WHERE title = 'Next Steps';
UPDATE Slide SET title = 'アクションアイテム' WHERE title = 'Action Items';
UPDATE Slide SET title = 'お問い合わせ' WHERE title = 'Contact' OR title = 'Contact Us';
UPDATE Slide SET title = 'ありがとうございました' WHERE title = 'Thank You' OR title = 'Thanks';

-- Display count of updated slides
SELECT 'Updated slides successfully!' as Message;
SELECT COUNT(*) as TotalSlides FROM Slide;
