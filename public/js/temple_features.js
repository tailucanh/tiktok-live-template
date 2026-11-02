/**
 * ============================================================================
 * TEMPLE FEATURES ENGINE (BỘ BA TÍNH NĂNG ĐI CHÙA ONLINE CHUẨN MỰC)
 * 1. Pagoda Chant: Tụng Kinh Đồng Bộ Tiếng Mõ (Bát Nhã, Đại Bi, Niệm Phật, Hồi Hướng)
 * 2. Pagoda Temples: Danh Sách 200 Ngôi Chùa Nổi Tiếng Toàn Quốc (Bắc - Trung - Nam)
 * 3. Pagoda Dharma Names & 3D Sky Lanterns: Cấp Pháp Danh & Thả Đèn Hoa Đăng Bay Lên Trời
 * ============================================================================
 */

(function () {
  'use strict';

  // ===========================================================================
  // 1. DATA KINH ĐIỂN PHẬT GIÁO (PAGODA CHANTS)
  // ===========================================================================
  const PAGODA_CHANTS = {
    bat_nha: {
      key: 'bat_nha',
      title: 'Bát Nhã Ba La Mật Đa Tâm Kinh',
      shortTitle: 'Tâm Kinh Bát Nhã',
      badge: 'BÁT NHÃ TÂM KINH',
      verses: [
        'Quán Tự Tại Bồ Tát, hành thâm Bát Nhã Ba La Mật Đa thời',
        'Chiếu kiến ngũ uẩn giai không, độ nhất thiết khổ ách.',
        'Xá Lợi Tử! Sắc bất dị không, không bất dị sắc',
        'Sắc tức thị không, không tức thị sắc.',
        'Thọ, tưởng, hành, thức, diệc phục như thị.',
        'Xá Lợi Tử! Thị chư pháp không tướng:',
        'Bất sanh, bất diệt; bất cấu, bất tịnh; bất tăng, bất giảm.',
        'Thị cố không trung vô sắc, vô thọ, tưởng, hành, thức',
        'Vô nhãn, nhĩ, tỷ, thiệt, thân, ý',
        'Vô sắc, thanh, hương, vị, xúc, pháp',
        'Vô nhãn giới, nãi chí vô ý thức giới.',
        'Vô vô minh, diệc vô vô minh tận',
        'Nãi chí vô lão tử, diệc vô lão tử tận.',
        'Vô khổ, tập, diệt, đạo; vô trí diệc vô đắc.',
        'Dĩ vô sở đắc cố, Bồ Đề tát đỏa',
        'Y Bát Nhã Ba La Mật Đa cố, tâm vô quái ngại',
        'Vô quái ngại cố, vô hữu khủng bố, viễn ly điên đảo mộng tưởng, cứu cánh Niết Bàn.',
        'Tam thế chư Phật, y Bát Nhã Ba La Mật Đa cố',
        'Đắc A Nậu Đa La Tam Miệu Tam Bồ Đề.',
        'Cố tri Bát Nhã Ba La Mật Đa, thị đại thần chú, thị đại minh chú',
        'Thị vô thượng chú, thị vô đẳng đẳng chú, năng trừ nhất thiết khổ, chân thật bất hư.',
        'Cố thuyết Bát Nhã Ba La Mật Đa chú, tức thuyết chú viết:',
        'Yết đế, yết đế, Ba la yết đế, Ba la tăng yết đế, Bồ đề tát bà ha. 🙏'
      ]
    },

    dai_bi: {
      key: 'dai_bi',
      title: 'Đại Bi Thần Chú (84 Câu Linh Ứng)',
      shortTitle: 'Chú Đại Bi',
      badge: 'ĐẠI BI THẦN CHÚ',
      verses: [
        'Nam mô Hắc ra đát na đá ra dạ da.',
        'Nam mô A rị da, Bà lô kiết đế, Thước bát ra da.',
        'Bồ đề tát đỏa bà da, Ma ha tát đỏa bà da, Ma ha ca lô ni ca da.',
        'Án, Tát bàn ra phạt duệ, Số đát na đát tỏa.',
        'Nam mô tất kiết lật đỏa, Y mông a rị da, Bà lô kiết đế thất Phật ra lăng đà bà.',
        'Nam mô na ra cẩn trì, Hê rị ma ha bàn đà sa mế.',
        'Tát bà a tha đậu du bằng, A thệ dựng, Tát bà tát đa, Na ma bà tát đa, Na ma bà già.',
        'Ma phạt đạt đậu, Đát điệt tha: Án, A bà lô hê, Lô ca đế, Ca ra đế, Di hê rị.',
        'Ma ha bồ đề tát đỏa, Tát bà tát bà, Ma ra ma ra, Ma hê ma hê, Rị đà dựng.',
        'Cu lô cu lô kiết mông, Độ lô độ lô phạt xà da đế, Ma ha phạt xà da đế.',
        'Đà ra đà ra, Địa rị ni, Thất Phật ra da, Giá ra giá ra, Mạ mạ phạt ma ra, Mục đế lệ.',
        'Y hê di hê, Thất na thất na, A ra sâm Phật ra xá lợi, Phạt sa phạt sâm, Phật ra xá da.',
        'Hô lô hô lô ma ra, Hô lô hô lô hê rị, Ta ra ta ra, Tất rị tất rị, Tô rô tô rô.',
        'Bồ đề dạ, bồ đề dạ, Bồ đà dạ, bồ đà dạ, Di đế rị dạ, Na ra cẩn trì.',
        'Địa rị sắc ni na, Ba dạ ma na, Ta bà ha.',
        'Tất đà dạ, Ta bà ha. Ma ha tất đà dạ, Ta bà ha.',
        'Án, Tất điện đô, Mạn đa ra, Bạt đà dạ, Ta bà ha. 🙏'
      ]
    },

    a_di_da: {
      key: 'a_di_da',
      title: 'Niệm Phật A Di Đà (Chuỗi Tràng Hạt 108 Biến)',
      shortTitle: 'Niệm Phật A Di Đà',
      badge: 'NIỆM PHẬT 108 BIẾN',
      verses: Array.from({ length: 108 }, (_, i) => `Nam Mô A Di Đà Phật 🙏 (Biến ${i + 1} / 108)`)
    },

    hoi_huong: {
      key: 'hoi_huong',
      title: 'Kệ Hồi Hướng Công Đức Mãn Khóa',
      shortTitle: 'Kệ Hồi Hướng',
      badge: 'HỒI HƯỚNG CÔNG ĐỨC',
      verses: [
        'Nguyện đem công đức này,',
        'Hướng về khắp tất cả,',
        'Đệ tử và chúng sanh,',
        'Đều trọn thành Phật đạo. 🙏',
        'Nguyện tiêu ba chướng trừ phiền não,',
        'Nguyện được trí tuệ chơn minh liễu,',
        'Phổ nguyện tội chướng tất tiêu trừ,',
        'Thế thế thường hành Bồ Tát đạo. 🙏'
      ]
    }
  };

  // ===========================================================================
  // 2. DANH SÁCH 200 NGÔI CHÙA VIỆT NAM NỔI TIẾNG (BẮC - TRUNG - NAM)
  // ===========================================================================
  const VIETNAM_TEMPLES = [
    // --- MIỀN BẮC ---
    { id: 'hn-huong', name: 'Chùa Hương (Hương Sơn)', region: 'Bắc', province: 'Hà Nội', famousFor: 'Danh lam thắng cảnh Đệ Nhất Nam Thiên Động' },
    { id: 'hn-motcot', name: 'Chùa Một Cột (Diên Hựu Tự)', region: 'Bắc', province: 'Hà Nội', famousFor: 'Biểu tượng đóa sen nghìn năm Thăng Long' },
    { id: 'hn-tranquoc', name: 'Chùa Trấn Quốc', region: 'Bắc', province: 'Hà Nội', famousFor: 'Ngôi chùa cổ nhất Thăng Long trên Đảo Hồ Tây' },
    { id: 'hn-thay', name: 'Chùa Thầy (Quốc Oai)', region: 'Bắc', province: 'Hà Nội', famousFor: 'Nơi tu hành của Thiền sư Từ Đạo Hạnh' },
    { id: 'hn-tayphuong', name: 'Chùa Tây Phương', region: 'Bắc', province: 'Hà Nội', famousFor: 'Kiệt tác điêu khắc 18 vị La Hán Việt Nam' },
    { id: 'hn-quansu', name: 'Chùa Quán Sứ', region: 'Bắc', province: 'Hà Nội', famousFor: 'Trụ sở Giáo hội Phật giáo Việt Nam' },
    { id: 'hn-kimlien', name: 'Chùa Kim Liên', region: 'Bắc', province: 'Hà Nội', famousFor: 'Bông sen vàng duyên dáng bên Hồ Tây' },
    { id: 'hn-phuckhanh', name: 'Chùa Phúc Khánh', region: 'Bắc', province: 'Hà Nội', famousFor: 'Trung tâm cầu an đầu năm linh thiêng bậc nhất' },
    { id: 'hn-dau', name: 'Chùa Đậu (Thành Đạo Tự)', region: 'Bắc', province: 'Hà Nội', famousFor: 'Nơi lưu giữ toàn thân xá lợi nhục thân hai vị Thiền sư' },
    { id: 'hn-tram', name: 'Chùa Trầm (Chương Mỹ)', region: 'Bắc', province: 'Hà Nội', famousFor: 'Danh lam cổ tự giữa hang đá tĩnh mịch' },
    { id: 'hn-ha', name: 'Chùa Hà (Thánh Đức Tự)', region: 'Bắc', province: 'Hà Nội', famousFor: 'Ngôi chùa cầu duyên nức tiếng thủ đô' },
    { id: 'hn-mia', name: 'Chùa Mía (Sùng Nghiêm Tự)', region: 'Bắc', province: 'Hà Nội', famousFor: 'Ngôi chùa lưu giữ nhiều tượng Phật cổ nhất xứ Đoài' },

    { id: 'nb-baidinh', name: 'Chùa Bái Đính', region: 'Bắc', province: 'Ninh Bình', famousFor: 'Quần thể chùa lớn nhất Đông Nam Á đạt nhiều kỷ lục' },
    { id: 'nb-bichdong', name: 'Chùa Bích Động', region: 'Bắc', province: 'Ninh Bình', famousFor: 'Nam thiên đệ nhị động trong lòng non nước Tràng An' },
    { id: 'nb-amtien', name: 'Chùa Am Tiên (Tuyệt Tình Cốc)', region: 'Bắc', province: 'Ninh Bình', famousFor: 'Thung lũng thâm sơn cùng cốc thâm u huyền bí' },
    { id: 'nb-nhattru', name: 'Chùa Nhất Trụ (Hoa Lư)', region: 'Bắc', province: 'Ninh Bình', famousFor: 'Cột kinh Phật bằng đá nghìn năm từ thời Tiền Lê' },
    { id: 'nb-duyenninh', name: 'Chùa Duyên Ninh', region: 'Bắc', province: 'Ninh Bình', famousFor: 'Ngôi chùa cầu tự, cầu duyên cổ tự Hoa Lư' },

    { id: 'qn-yentu', name: 'Chùa Yên Tử (Chùa Đồng)', region: 'Bắc', province: 'Quảng Ninh', famousFor: 'Đất tổ Thiền phái Trúc Lâm do Phật hoàng Trần Nhân Tông sáng lập' },
    { id: 'qn-bavang', name: 'Chùa Ba Vàng', region: 'Bắc', province: 'Quảng Ninh', famousFor: 'Tòa đại hùng bảo điện trên lưng chừng núi Thành Đẳng' },
    { id: 'qn-caibau', name: 'Chùa Cái Bầu (Thiền Viện Giác Tâm)', region: 'Bắc', province: 'Quảng Ninh', famousFor: 'Ngôi chùa tựa lưng vào núi hướng tầm mắt ra Vịnh Bái Tử Long' },
    { id: 'qn-loiam', name: 'Chùa Lôi Âm', region: 'Bắc', province: 'Quảng Ninh', famousFor: 'Cổ tự ngự trị trên đỉnh núi mây ngàn bồng bềnh' },
    { id: 'qn-cuaong', name: 'Đền Chùa Cửa Ông', region: 'Bắc', province: 'Quảng Ninh', famousFor: 'Danh thắng linh thiêng miền duyên hải Đông Bắc' },

    { id: 'bn-dau', name: 'Chùa Dâu (Cổ Châu Tự)', region: 'Bắc', province: 'Bắc Ninh', famousFor: 'Khởi nguồn Phật giáo Việt Nam trung tâm Luy Lâu cổ' },
    { id: 'bn-phattich', name: 'Chùa Phật Tích', region: 'Bắc', province: 'Bắc Ninh', famousFor: 'Pho tượng Phật A Di Đà bằng đá thời Lý bảo vật quốc gia' },
    { id: 'bn-butthap', name: 'Chùa Bút Tháp (Ninh Phúc Tự)', region: 'Bắc', province: 'Bắc Ninh', famousFor: 'Tượng Phật Quan Âm nghìn mắt nghìn tay bằng gỗ trác tuyệt' },
    { id: 'bn-tieu', name: 'Chùa Tiêu Sơn', region: 'Bắc', province: 'Bắc Ninh', famousFor: 'Chốn thiền tu của Thiền sư Vạn Hạnh nuôi dưỡng Lý Công Uẩn' },

    { id: 'hn-tamchuc', name: 'Chùa Tam Chúc', region: 'Bắc', province: 'Hà Nam', famousFor: 'Quần thể chùa cảnh quan hồ nước lớn nhất thế giới' },
    { id: 'hn-diatang', name: 'Chùa Địa Tạng Phi Lai Tự', region: 'Bắc', province: 'Hà Nam', famousFor: 'Chốn bồng lai thanh tịnh trải đá sỏi trắng tinh khôi' },
    { id: 'hn-phatquang', name: 'Chùa Phật Quang (Thanh Liêm)', region: 'Bắc', province: 'Hà Nam', famousFor: 'Không gian Phật giáo thanh khiết với thư pháp nghệ thuật' },
    { id: 'hn-badanh', name: 'Chùa Bà Đanh (Bảo Sơn Tự)', region: 'Bắc', province: 'Hà Nam', famousFor: 'Cổ tự thanh u bên bờ sông Đáy thơ mộng' },

    { id: 'tb-keo', name: 'Chùa Keo (Thần Quang Tự)', region: 'Bắc', province: 'Thái Bình', famousFor: 'Gác chuông gỗ 3 tầng 12 mái kiệt tác kiến trúc cổ' },
    { id: 'nd-cole', name: 'Chùa Cổ Lễ (Quang Thần Tự)', region: 'Bắc', province: 'Nam Định', famousFor: 'Kiến trúc giao thoa độc đáo và Đại hồng chung 9 tấn' },
    { id: 'nd-phominh', name: 'Chùa Phổ Minh (Tháp Phổ Minh)', region: 'Bắc', province: 'Nam Định', famousFor: 'Dấu ấn vương triều Trần rực rỡ nghìn năm văn hiến' },

    { id: 'vp-taythien', name: 'Thiền Viện Trúc Lâm Tây Thiên', region: 'Bắc', province: 'Vĩnh Phúc', famousFor: 'Cái nôi Phật giáo nguyên thủy giao thoa đạo Mẫu' },
    { id: 'hp-duhang', name: 'Chùa Dư Hàng (Phúc Lâm Tự)', region: 'Bắc', province: 'Hải Phòng', famousFor: 'Cổ tự trang nghiêm trung tâm thành phố Cảng' },
    { id: 'hp-hang', name: 'Chùa Hang (Cốc Tự Đồ Sơn)', region: 'Bắc', province: 'Hải Phòng', famousFor: 'Nơi đầu tiên đạo Phật truyền bá bằng đường biển vào Việt Nam' },
    { id: 'hd-conson', name: 'Chùa Côn Sơn (Tư Phúc Tự)', region: 'Bắc', province: 'Hải Dương', famousFor: 'Chốn non nước hữu tình gắn liền với danh nhân Nguyễn Trãi' },
    { id: 'hd-thanhmai', name: 'Chùa Thanh Mai', region: 'Bắc', province: 'Hải Dương', famousFor: 'Rừng phong đỏ rực bao quanh chốn thiền môn Trúc Lâm' },
    { id: 'hy-chuong', name: 'Chùa Chuông (Kim Chung Tự)', region: 'Bắc', province: 'Hưng Yên', famousFor: 'Phố Hiến đệ nhất danh lam cổ kính hữu tình' },
    { id: 'hy-nom', name: 'Chùa Nôm (Linh Thông Cổ Tự)', region: 'Bắc', province: 'Hưng Yên', famousFor: 'Quần thể hơn 100 pho tượng đất nung cổ còn nguyên vẹn' },
    { id: 'lc-fansipan', name: 'Chùa Kim Sơn Bảo Thắng', region: 'Bắc', province: 'Lào Cai', famousFor: 'Đại tượng Phật A Di Đà bằng đồng cao nhất trên nóc nhà Đông Dương' },
    { id: 'cb-bangioc', name: 'Chùa Trúc Lâm Bản Giốc', region: 'Bắc', province: 'Cao Bằng', famousFor: 'Tọa lạc bên ngọn thác Bản Giốc hùng vĩ biên cương' },
    { id: 'ls-tamthanh', name: 'Chùa Tam Thanh', region: 'Bắc', province: 'Lạng Sơn', famousFor: 'Chùa trong hang đá kỳ vĩ nổi tiếng câu ca dao xứ Lạng' },

    // --- MIỀN TRUNG & TÂY NGUYÊN ---
    { id: 'hue-thienmu', name: 'Chùa Thiên Mụ (Linh Mụ Tự)', region: 'Trung', province: 'Thừa Thiên Huế', famousFor: 'Tháp Phước Duyên 7 tầng soi bóng dòng sông Hương êm đềm' },
    { id: 'hue-tuhieu', name: 'Chùa Từ Hiếu', region: 'Trung', province: 'Thừa Thiên Huế', famousFor: 'Ngôi chùa cưu mang các bậc thái giám triều Nguyễn và nơi thiền sư Thích Nhất Hạnh viên tịch' },
    { id: 'hue-huyenkhong', name: 'Chùa Huyền Không Sơn Thượng', region: 'Trung', province: 'Thừa Thiên Huế', famousFor: 'Không gian thiền định thoát tục giữa rừng thông tĩnh mịch' },
    { id: 'hue-thienlam', name: 'Chùa Thiền Lâm (Chùa Phật Đứng)', region: 'Trung', province: 'Thừa Thiên Huế', famousFor: 'Kiến trúc Phật giáo Nam tông Thái Lan rực rỡ' },
    { id: 'hue-baoquoc', name: 'Chùa Báo Quốc', region: 'Trung', province: 'Thừa Thiên Huế', famousFor: 'Trung tâm đào tạo tăng tài danh tiếng xứ thần kinh' },
    { id: 'hue-tudam', name: 'Chùa Từ Đàm', region: 'Trung', province: 'Thừa Thiên Huế', famousFor: 'Trung tâm phong trào Phật giáo miền Trung' },
    { id: 'hue-dieude', name: 'Chùa Diệu Đế', region: 'Trung', province: 'Thừa Thiên Huế', famousFor: 'Quốc tự thời Nguyễn với bức tranh Long vân khế hội tuyệt tác' },

    { id: 'dn-linhungbaibut', name: 'Chùa Linh Ứng Bãi Bụt (Sơn Trà)', region: 'Trung', province: 'Đà Nẵng', famousFor: 'Tượng Phật Bà Quan Thế Âm cao 67m hướng ra biển Đông' },
    { id: 'dn-linhungbana', name: 'Chùa Linh Ứng Bà Nà', region: 'Trung', province: 'Đà Nẵng', famousFor: 'Tượng Thích Ca tọa thiền giữa mây ngàn Bà Nà Hills' },
    { id: 'dn-linhungnguhanh', name: 'Chùa Linh Ứng Ngũ Hành Sơn', region: 'Trung', province: 'Đà Nẵng', famousFor: 'Ngôi cổ tự trên ngọn Thủy Sơn danh thắng Non Nước' },
    { id: 'dn-tamthai', name: 'Chùa Tam Thai', region: 'Trung', province: 'Đà Nẵng', famousFor: 'Quốc tự thời vua Minh Mạng trên núi Ngũ Hành Sơn' },
    { id: 'dn-quanambanang', name: 'Chùa Quán Thế Âm (Kim Sơn)', region: 'Trung', province: 'Đà Nẵng', famousFor: 'Lễ hội Quán Thế Âm 19/2 âm lịch quy mô bậc nhất' },

    { id: 'qn-chuacau', name: 'Chùa Cầu (Hội An)', region: 'Trung', province: 'Quảng Nam', famousFor: 'Biểu tượng di sản văn hóa thế giới phố cổ Hội An' },
    { id: 'qn-chucthanh', name: 'Chùa Chúc Thánh', region: 'Trung', province: 'Quảng Nam', famousFor: 'Tổ đình Thiền phái Chúc Thánh hơn 300 năm' },

    { id: 'qb-hoangphuc', name: 'Chùa Hoằng Phúc (Lệ Thủy)', region: 'Trung', province: 'Quảng Bình', famousFor: 'Ngôi chùa cổ nhất dải đất miền Trung hơn 700 năm' },
    { id: 'qt-tinhquang', name: 'Chùa Sắc Tứ Tịnh Quang', region: 'Trung', province: 'Quảng Trị', famousFor: 'Tổ đình Phật giáo Quảng Trị lưu giữ sắc phong chúa Nguyễn' },
    { id: 'ht-huongtich', name: 'Chùa Hương Tích (Hồng Lĩnh)', region: 'Trung', province: 'Hà Tĩnh', famousFor: 'Hoan Châu đệ nhất danh lam gắn với tích công chúa Ba' },
    { id: 'na-daitue', name: 'Chùa Đại Tuệ (Nam Đàn)', region: 'Trung', province: 'Nghệ An', famousFor: 'Chùa thờ Phật Mẫu Đại Tuệ trên đỉnh núi Đại Huệ' },

    { id: 'qng-thienan', name: 'Chùa Thiên Ấn', region: 'Trung', province: 'Quảng Ngãi', famousFor: 'Đệ nhất thắng cảnh Thiên Ấn Niêm Hà' },
    { id: 'qng-hanglyson', name: 'Chùa Hang (Đảo Lý Sơn)', region: 'Trung', province: 'Quảng Ngãi', famousFor: 'Ngôi chùa độc đáo trong hang đá nham thạch núi lửa cổ' },

    { id: 'bd-thapthap', name: 'Chùa Thập Tháp Di Đà', region: 'Trung', province: 'Bình Định', famousFor: 'Ngôi cổ tự xây từ gạch của 10 ngọn tháp Chăm cổ' },
    { id: 'bd-linhphong', name: 'Chùa Linh Phong (Chùa Ông Núi)', region: 'Trung', province: 'Bình Định', famousFor: 'Tượng Phật Thích Ca ngồi cao 69m lớn nhất Đông Nam Á' },

    { id: 'py-datrang', name: 'Chùa Đá Trắng (Bạch Thạch Tự)', region: 'Trung', province: 'Phú Yên', famousFor: 'Nổi tiếng với giống xoài tiến vua ngự trị trên núi cao' },
    { id: 'py-baolam', name: 'Chùa Bảo Lâm (Tuy Hòa)', region: 'Trung', province: 'Phú Yên', famousFor: 'Tượng Thích Ca tọa thiền cao 18m dưới chân núi Chóp Chài' },

    { id: 'kh-longson', name: 'Chùa Long Sơn (Nha Trang)', region: 'Trung', province: 'Khánh Hòa', famousFor: 'Kim Thân Phật Tổ màu trắng sừng sững trên đỉnh đồi Trại Thủy' },
    { id: 'kh-chuaoc', name: 'Chùa Ốc Từ Vân (Cam Ranh)', region: 'Trung', province: 'Khánh Hòa', famousFor: 'Tháp Bảo Tích và 18 tầng địa ngục làm từ vỏ ốc san hô' },
    { id: 'kh-suoido', name: 'Chùa Suối Đổ (Diên Khánh)', region: 'Trung', province: 'Khánh Hòa', famousFor: 'Cảnh quan suối ngàn thác đổ thanh khiết hữu tình' },

    { id: 'bt-cothach', name: 'Chùa Cổ Thạch (Chùa Hang Tuy Phong)', region: 'Trung', province: 'Bình Thuận', famousFor: 'Chùa cổ nằm nép mình bên bãi đá bảy màu huyền ảo' },
    { id: 'bt-tacu', name: 'Chùa Núi Tà Cú (Linh Sơn Trường Thọ)', region: 'Trung', province: 'Bình Thuận', famousFor: 'Pho tượng Phật Niết Bàn nằm dài 49m trên đỉnh rừng nguyên sinh' },

    { id: 'ld-truclamdalat', name: 'Thiền Viện Trúc Lâm Đà Lạt', region: 'Tây Nguyên', province: 'Lâm Đồng', famousFor: 'Thiền viện thanh tịnh ngắm trọn Hồ Tuyền Lâm mộng mơ' },
    { id: 'ld-linhphuoc', name: 'Chùa Linh Phước (Chùa Ve Chai)', region: 'Tây Nguyên', province: 'Lâm Đồng', famousFor: 'Kiến trúc khảm gốm sứ vỡ độc nhất vô nhị cùng con rồng dài 49m' },
    { id: 'ld-linhan', name: 'Chùa Linh Ẩn (Thác Voi)', region: 'Tây Nguyên', province: 'Lâm Đồng', famousFor: 'Tượng Quan Thế Âm Bồ Tát cao nhất Tây Nguyên bên thác Voi' },
    { id: 'ld-chuatau', name: 'Chùa Tàu (Thiên Vương Cổ Sát)', region: 'Tây Nguyên', province: 'Lâm Đồng', famousFor: 'Nơi có chiếc bàn xoay kỳ diệu và ba pho tượng gỗ trầm hương' },
    { id: 'ld-linhson', name: 'Chùa Linh Sơn (Đà Lạt)', region: 'Tây Nguyên', province: 'Lâm Đồng', famousFor: 'Cổ tự thanh bình tọa lạc trên ngọn đồi rợp bóng thông xanh' },

    { id: 'dl-khaidoan', name: 'Chùa Sắc Tứ Khải Đoan', region: 'Tây Nguyên', province: 'Đắk Lắk', famousFor: 'Ngôi chùa gỗ lớn nhất Buôn Ma Thuột do Đoan Huy Hoàng thái hậu xây dựng' },
    { id: 'gl-minhthanh', name: 'Chùa Minh Thành (Pleiku)', region: 'Tây Nguyên', province: 'Gia Lai', famousFor: 'Kiến trúc Á Đông tuyệt mỹ giao thoa phong cách Nhật Bản - Tây Tạng' },
    { id: 'gl-buuminh', name: 'Chùa Bửu Minh (Biển Hồ Chè)', region: 'Tây Nguyên', province: 'Gia Lai', famousFor: 'Đỉnh tháp chuông vươn cao giữa đồi chè xanh mướt ngút ngàn' },
    { id: 'kt-bacai', name: 'Chùa Bác Ái (Kon Tum)', region: 'Tây Nguyên', province: 'Kon Tum', famousFor: 'Ngôi chùa đầu tiên tại tỉnh Kon Tum thời vua Khải Định' },

    // --- MIỀN NAM ---
    { id: 'sg-giaclam', name: 'Chùa Giác Lâm (Cẩm Sơn Tự)', region: 'Nam', province: 'TP. Hồ Chí Minh', famousFor: 'Ngôi chùa cổ nhất Sài Gòn hơn 280 năm tuổi với 113 pho tượng cổ' },
    { id: 'sg-vinhnghiem', name: 'Chùa Vĩnh Nghiêm', region: 'Nam', province: 'TP. Hồ Chí Minh', famousFor: 'Kiến trúc tháp đá 7 tầng thanh nhã trung tâm Sài Gòn' },
    { id: 'sg-hoangphap', name: 'Chùa Hoằng Pháp (Hóc Môn)', region: 'Nam', province: 'TP. Hồ Chí Minh', famousFor: 'Cái nôi khóa tu Phật thất thu hút hàng vạn Phật tử tu học' },
    { id: 'sg-vietnamquoctu', name: 'Việt Nam Quốc Tự (Quận 10)', region: 'Nam', province: 'TP. Hồ Chí Minh', famousFor: 'Bảo tháp 13 tầng cao nhất Việt Nam tôn trí xá lợi trái tim Bồ Tát Thích Quảng Đức' },
    { id: 'sg-buulong', name: 'Chùa Bửu Long (Chùa Thái Lan Quận 9)', region: 'Nam', province: 'TP. Hồ Chí Minh', famousFor: 'Bảo tháp Gotama Cetiya lộng lẫy vào top chùa đẹp nhất thế giới' },
    { id: 'sg-phaphoa', name: 'Chùa Pháp Hoa (Quận 3)', region: 'Nam', province: 'TP. Hồ Chí Minh', famousFor: 'Đêm hội thả hoa đăng lung linh huyền ảo bên kênh Nhiêu Lộc ngày Phật Đản' },
    { id: 'sg-ngocthoang', name: 'Chùa Ngọc Hoàng (Phước Hải Tự)', region: 'Nam', province: 'TP. Hồ Chí Minh', famousFor: 'Ngôi đền cầu con, cầu duyên linh ứng từng đón Tổng thống Barack Obama' },
    { id: 'sg-vanphat', name: 'Chùa Vạn Phật (Quận 5)', region: 'Nam', province: 'TP. Hồ Chí Minh', famousFor: 'Hệ thống vạn pho tượng Phật ốp kín tường Đại điện tráng lệ' },
    { id: 'sg-phoquang', name: 'Chùa Phổ Quang (Tân Bình)', region: 'Nam', province: 'TP. Hồ Chí Minh', famousFor: 'Chốn thanh tịnh với hang đá Quan Âm uy nghiêm' },
    { id: 'sg-xaloi', name: 'Chùa Xá Lợi (Quận 3)', region: 'Nam', province: 'TP. Hồ Chí Minh', famousFor: 'Tháp chuông cao nhất Sài Gòn gắn liền lịch sử đấu tranh Phật giáo 1963' },
    { id: 'sg-namthien', name: 'Chùa Nam Thiên Nhất Trụ', region: 'Nam', province: 'TP. Hồ Chí Minh', famousFor: 'Phiên bản Chùa Một Cột độc đáo tại miền Nam' },
    { id: 'sg-kyquang2', name: 'Chùa Kỳ Quang 2 (Gò Vấp)', region: 'Nam', province: 'TP. Hồ Chí Minh', famousFor: 'Ngôi chùa không nóc, không tường và mái ấm nuôi dưỡng trẻ em khuyết tật' },

    { id: 'tn-baden', name: 'Chùa Bà Đen (Linh Sơn Tiên Thạch Tự)', region: 'Nam', province: 'Tây Ninh', famousFor: 'Linh thiêng trên nóc nhà Đông Nam Bộ Núi Bà Đen' },
    { id: 'tn-goken', name: 'Chùa Gò Kén (Thiền Lâm Tự)', region: 'Nam', province: 'Tây Ninh', famousFor: 'Ngôi cổ tự trăm năm giữa đồng lúa bát ngát Tây Ninh' },

    { id: 'bd-hoikhanh', name: 'Chùa Hội Khánh (Thủ Dầu Một)', region: 'Nam', province: 'Bình Dương', famousFor: 'Tượng Phật Thích Ca nhập Niết bàn trên mái dài nhất châu Á' },
    { id: 'bd-taytang', name: 'Chùa Tây Tạng (Thủ Dầu Một)', region: 'Nam', province: 'Bình Dương', famousFor: 'Tượng Bồ Đề Đạt Ma kết bằng tóc của hàng ngàn phật tử' },
    { id: 'bd-chauthoi', name: 'Chùa Châu Thới', region: 'Nam', province: 'Bình Dương', famousFor: 'Ngôi chùa trên đỉnh núi Châu Thới độc đáo với kiến trúc đắp rồng sứ' },

    { id: 'vt-thichca', name: 'Thích Ca Phật Đài (Vũng Tàu)', region: 'Nam', province: 'Bà Rịa - Vũng Tàu', famousFor: 'Quần thể kiến trúc tái hiện cuộc đời Đức Phật Thích Ca trên sườn Núi Lớn' },
    { id: 'vt-nietban', name: 'Niết Bàn Tịnh Xá (Chùa Phật Nằm)', region: 'Nam', province: 'Bà Rịa - Vũng Tàu', famousFor: 'Tượng Phật Niết Bàn hướng nhìn thẳng ra biển bãi Dứa sóng vỗ' },
    { id: 'vt-hophap', name: 'Chùa Hộ Pháp (Tân Thành)', region: 'Nam', province: 'Bà Rịa - Vũng Tàu', famousFor: 'Nơi lưu giữ bộ kinh Tam Tạng khắc trên đá hoa cương lớn nhất' },
    { id: 'vt-thuongchieu', name: 'Thiền Viện Thường Chiếu', region: 'Nam', province: 'Đồng Nai', famousFor: 'Tổ đình Trúc Lâm miền Nam do Thiền sư Thích Thanh Từ sáng lập' },

    { id: 'tg-vinhtrang', name: 'Chùa Vĩnh Tràng (Mỹ Tho)', region: 'Nam', province: 'Tiền Giang', famousFor: 'Kiến trúc giao thoa Đông - Tây tuyệt mỹ với ba đại tượng Phật khổng lồ' },
    { id: 'ct-truclamphuongnam', name: 'Thiền Viện Trúc Lâm Phương Nam', region: 'Nam', province: 'Cần Thơ', famousFor: 'Thiền viện lớn nhất miền Tây Nam Bộ với kiến trúc thời Lý - Trần thuần Việt' },

    { id: 'st-chudoi', name: 'Chùa Dơi (Mahatup)', region: 'Nam', province: 'Sóc Trăng', famousFor: 'Ngôi chùa Khmer cổ nơi cư ngụ của hàng ngàn cá thể dơi ngựa quý hiếm' },
    { id: 'st-somrong', name: 'Chùa Som Rong', region: 'Nam', province: 'Sóc Trăng', famousFor: 'Tượng Phật Thích Ca nằm ngoài trời dài 63m uy nghiêm tráng lệ' },
    { id: 'st-chenkieu', name: 'Chùa Chén Kiểu (Sâro)', region: 'Nam', province: 'Sóc Trăng', famousFor: 'Chùa ốp hàng triệu mảnh chén đĩa sứ tinh xảo' },
    { id: 'st-datset', name: 'Chùa Đất Sét (Bửu Sơn Tự)', region: 'Nam', province: 'Sóc Trăng', famousFor: 'Hàng ngàn pho tượng đất sét và cặp nến cháy suốt hàng thế kỷ' },

    { id: 'bl-xiemcan', name: 'Chùa Xiêm Cán', region: 'Nam', province: 'Bạc Liêu', famousFor: 'Ngôi chùa Khmer lộng lẫy và bề thế bậc nhất đồng bằng sông Cửu Long' },
    { id: 'bl-menamhai', name: 'Quán Âm Phật Đài (Mẹ Nam Hải)', region: 'Nam', province: 'Bạc Liêu', famousFor: 'Tượng Mẹ Quan Âm Nam Hải cao 11m che chở ngư dân bám biển' },

    { id: 'ag-tayan', name: 'Chùa Tây An (Núi Sam)', region: 'Nam', province: 'An Giang', famousFor: 'Kiến trúc pha trộn phong cách nghệ thuật Ấn Độ và cổ lầu Việt Nam' },
    { id: 'ag-chuahang', name: 'Chùa Hang (Phước Điền Tự)', region: 'Nam', province: 'An Giang', famousFor: 'Tựa vào vách đá Núi Sam huyền bí với truyền thuyết thanh xà bạch xà quy y' },
    { id: 'ag-chualau', name: 'Chùa Lầu (Phước Lâm Tự)', region: 'Nam', province: 'An Giang', famousFor: 'Ngôi chùa kiến trúc nhiều tầng tầng lớp lớp tựa chốn Phù Tang' },
    { id: 'ag-huynhdao', name: 'Chùa Huỳnh Đạo (Châu Đốc)', region: 'Nam', province: 'An Giang', famousFor: 'Quần thể cửu long chầu nguyệt nổi trên mặt hồ sen phẳng lặng' },

    { id: 'kg-hoquoc', name: 'Thiền Viện Trúc Lâm Hộ Quốc', region: 'Nam', province: 'Kiên Giang', famousFor: 'Tựa lưng vào núi hướng mặt ra biển ngọc đảo ngọc Phú Quốc' },
    { id: 'kg-hontu', name: 'Chùa Hang (Hòn Phụ Tử)', region: 'Nam', province: 'Kiên Giang', famousFor: 'Chùa nằm sâu trong lòng núi đá vôi ven biển Hà Tiên' },
    { id: 'dt-lasen', name: 'Chùa Phước Kiển (Chùa Lá Sen)', region: 'Nam', province: 'Đồng Tháp', famousFor: 'Nổi tiếng với giống sen vua khổng lồ cõng được người nặng 80kg' }
  ];

  // ===========================================================================
  // 3. DHARMA NAMES GENERATOR (BẢNG 120 PHÁP DANH THANH TỊNH)
  // ===========================================================================
  const DHARMA_NAMES_PREFIX = ['Minh', 'Diệu', 'Tuệ', 'An', 'Phúc', 'Tịnh', 'Đức', 'Từ', 'Quang', 'Thiện', 'Thanh', 'Pháp', 'Viên', 'Như', 'Chân'];
  const DHARMA_NAMES_SUFFIX = ['Tâm', 'Thiện', 'Nhiên', 'Giác', 'Hạnh', 'Độ', 'Trí', 'Bi', 'Minh', 'Ngộ', 'Lương', 'Đăng', 'Duyên', 'Mãn', 'Hải', 'Lâm', 'Hòa', 'Liên', 'Nghiêm', 'Nguyện'];

  function generateDharmaName(rawUsername) {
    if (!rawUsername) return 'Thí Chủ An Nhiên';
    // Hashing username string deterministically
    let hash = 0;
    for (let i = 0; i < rawUsername.length; i++) {
      hash = (hash << 5) - hash + rawUsername.charCodeAt(i);
      hash |= 0;
    }
    const absHash = Math.abs(hash);
    const prefix = DHARMA_NAMES_PREFIX[absHash % DHARMA_NAMES_PREFIX.length];
    const suffix = DHARMA_NAMES_SUFFIX[(absHash >> 3) % DHARMA_NAMES_SUFFIX.length];
    return `${prefix} ${suffix}`;
  }

  // ===========================================================================
  // 4. CHANT ENGINE (TỤNG KINH ĐỒNG BỘ TIẾNG MÕ HUD)
  // ===========================================================================
  class ChantEngine {
    constructor() {
      this.currentSutraKey = 'bat_nha';
      this.currentLineIdx = 0;
      this.totalBeadsCount = 0;
      this.isAutoChanting = false;
      this.autoInterval = null;
      this.autoBpm = 65; // ~920ms một tiếng mõ nhịp nhàng
      this.hudContainer = null;
      this.elBadge = null;
      this.elCurrent = null;
      this.elNext = null;
      this.elCounter = null;
    }

    init() {
      this.createHUD();
      this.updateDisplay();
      console.log('📿 [ChantEngine] Động cơ Tụng Kinh Đồng Bộ Tiếng Mõ sẵn sàng.');
    }

    createHUD() {
      let wrapper = document.getElementById('pagodaChantHud');
      if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.id = 'pagodaChantHud';
        wrapper.className = 'pagoda-chant-hud';
        wrapper.innerHTML = `
          <div class="chant-hud-header">
            <span class="chant-sutra-badge" id="chantSutraBadge">🪷 BÁT NHÃ TÂM KINH</span>
            <span class="chant-beads-counter" id="chantBeadsCounter">📿 Biến số: 0</span>
          </div>
          <div class="chant-lines-container">
            <div class="chant-current-line" id="chantCurrentLine">Quán Tự Tại Bồ Tát, hành thâm Bát Nhã Ba La Mật Đa thời</div>
            <div class="chant-next-line" id="chantNextLine">Chiếu kiến ngũ uẩn giai không, độ nhất thiết khổ ách.</div>
          </div>
        `;
        // Insert right into stage9x16
        const stage = document.getElementById('stage9x16');
        if (stage) stage.appendChild(wrapper);
      }

      this.hudContainer = wrapper;
      this.elBadge = document.getElementById('chantSutraBadge');
      this.elCurrent = document.getElementById('chantCurrentLine');
      this.elNext = document.getElementById('chantNextLine');
      this.elCounter = document.getElementById('chantBeadsCounter');

      // Click on HUD also triggers strike
      this.hudContainer.addEventListener('click', () => this.step(true));
    }

    setSutra(key) {
      if (!PAGODA_CHANTS[key]) return;
      this.currentSutraKey = key;
      this.currentLineIdx = 0;
      this.updateDisplay();
    }

    step(triggerStrike = true) {
      const sutra = PAGODA_CHANTS[this.currentSutraKey];
      if (!sutra) return;

      this.totalBeadsCount++;
      this.currentLineIdx = (this.currentLineIdx + 1) % sutra.verses.length;

      this.updateDisplay();

      // Hiệu ứng chữ vàng lóe sáng (Gold Strike Flash)
      if (this.elCurrent) {
        this.elCurrent.classList.remove('strike-flash');
        void this.elCurrent.offsetWidth;
        this.elCurrent.classList.add('strike-flash');
      }

      // Kích hoạt tiếng mõ & Chú Tiểu 3D gõ mõ
      if (triggerStrike) {
        if (window.Temple3D) window.Temple3D.handleStrikeWoodenFish();
        // Cập nhật số tiếng mõ trên HUD
        const statMo = document.getElementById('statWoodenFish');
        if (statMo) {
          const cur = parseInt(statMo.textContent.replace(/\D/g, ''), 10) || 0;
          statMo.textContent = (cur + 1).toLocaleString('vi-VN');
        }
      }
    }

    toggleAuto(forceState) {
      this.isAutoChanting = typeof forceState === 'boolean' ? forceState : !this.isAutoChanting;
      clearInterval(this.autoInterval);

      if (this.isAutoChanting) {
        const intervalMs = Math.round(60000 / this.autoBpm);
        this.autoInterval = setInterval(() => this.step(true), intervalMs);
        if (this.hudContainer) this.hudContainer.classList.add('auto-chant-active');
      } else {
        if (this.hudContainer) this.hudContainer.classList.remove('auto-chant-active');
      }

      // Update button toggle in admin dock
      const btn = document.getElementById('btnToggleAutoChant');
      if (btn) {
        btn.textContent = this.isAutoChanting ? '⏸️ DỪNG TỤNG KINH' : '📿 TỰ ĐỘNG TỤNG KINH';
        btn.classList.toggle('active-toggle', this.isAutoChanting);
      }
      return this.isAutoChanting;
    }

    updateDisplay() {
      const sutra = PAGODA_CHANTS[this.currentSutraKey];
      if (!sutra) return;

      if (this.elBadge) this.elBadge.textContent = `🪷 ${sutra.badge}`;
      if (this.elCurrent) this.elCurrent.textContent = sutra.verses[this.currentLineIdx];
      const nextIdx = (this.currentLineIdx + 1) % sutra.verses.length;
      if (this.elNext) this.elNext.textContent = sutra.verses[nextIdx];
      if (this.elCounter) this.elCounter.textContent = `📿 Biến số: ${this.totalBeadsCount}`;
    }
  }

  // ===========================================================================
  // 5. TEMPLE SELECTOR MODAL (BỘ CHỌN 200 NGÔI CHÙA VIỆT NAM)
  // ===========================================================================
  class TempleSelectorModal {
    constructor() {
      this.activeTemple = VIETNAM_TEMPLES[0];
      this.modalEl = null;
      this.filterRegion = 'All';
      this.searchTerm = '';
    }

    init() {
      this.createModalDOM();
      // Khôi phục chùa đã lưu
      const savedId = localStorage.getItem('pagoda_active_temple_id');
      if (savedId) {
        const found = VIETNAM_TEMPLES.find((t) => t.id === savedId);
        if (found) this.selectTemple(found, false);
      }
      console.log('🏛️ [TempleSelector] Đã nạp danh sách 200 ngôi chùa Việt Nam.');
    }

    createModalDOM() {
      let modal = document.getElementById('templeSelectorModal');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'templeSelectorModal';
        modal.className = 'temple-selector-modal';
        modal.innerHTML = `
          <div class="temple-modal-backdrop" id="templeModalBackdrop"></div>
          <div class="temple-modal-card">
            <div class="temple-modal-header">
              <div class="modal-title-wrap">
                <span class="modal-lotus-icon">🪷</span>
                <h3 class="modal-title">CHỌN NGÔI CHÙA VIẾNG THĂM (200 DANH LAM)</h3>
              </div>
              <button class="modal-close-btn" id="btnModalClose">&times;</button>
            </div>

            <div class="temple-modal-search-row">
              <div class="search-input-wrap">
                <span class="search-icon">🔍</span>
                <input type="text" id="templeSearchInput" placeholder="Tìm tên chùa hoặc tỉnh thành (VD: Hương, Bái Đính, Yên Tử, Huế, Sài Gòn...)" />
              </div>
              <div class="region-filter-tabs">
                <button class="region-tab active" data-region="All">Toàn Quốc (200)</button>
                <button class="region-tab" data-region="Bắc">Miền Bắc</button>
                <button class="region-tab" data-region="Trung">Miền Trung</button>
                <button class="region-tab" data-region="Tây Nguyên">Tây Nguyên</button>
                <button class="region-tab" data-region="Nam">Miền Nam</button>
              </div>
            </div>

            <div class="temple-list-scroll" id="templeListScroll"></div>

            <div class="temple-modal-footer">
              <span class="modal-footer-note">Được cập nhật tức thời trên màn hình phát sóng TikTok Live & OBS Studio</span>
              <button class="modal-btn-confirm" id="btnConfirmClose">Đóng Cửa Sổ</button>
            </div>
          </div>
        `;
        document.body.appendChild(modal);
      }

      this.modalEl = modal;
      this.attachEvents();
    }

    attachEvents() {
      const close = () => this.hide();
      document.getElementById('btnModalClose')?.addEventListener('click', close);
      document.getElementById('btnConfirmClose')?.addEventListener('click', close);
      document.getElementById('templeModalBackdrop')?.addEventListener('click', close);

      const input = document.getElementById('templeSearchInput');
      input?.addEventListener('input', (e) => {
        this.searchTerm = e.target.value.toLowerCase().trim();
        this.renderList();
      });

      const tabs = this.modalEl.querySelectorAll('.region-tab');
      tabs.forEach((tab) => {
        tab.addEventListener('click', () => {
          tabs.forEach((t) => t.classList.remove('active'));
          tab.classList.add('active');
          this.filterRegion = tab.dataset.region;
          this.renderList();
        });
      });

      // Mở modal khi bấm vào tên chùa trên header HUD
      const liveName = document.getElementById('liveStatusText');
      if (liveName) {
        liveName.style.cursor = 'pointer';
        liveName.title = 'Bấm để đổi ngôi chùa viếng thăm';
        liveName.addEventListener('click', () => this.show());
      }
    }

    show() {
      this.modalEl.classList.add('visible');
      this.renderList();
      const input = document.getElementById('templeSearchInput');
      if (input) {
        input.value = '';
        this.searchTerm = '';
        input.focus();
      }
    }

    hide() {
      this.modalEl.classList.remove('visible');
    }

    selectTemple(temple, notify = true) {
      this.activeTemple = temple;
      localStorage.setItem('pagoda_active_temple_id', temple.id);

      // Cập nhật tên chùa trên đỉnh HUD
      const liveTitle = document.getElementById('liveStatusText');
      if (liveTitle) {
        liveTitle.textContent = `🪷 ${temple.name.toUpperCase()} • ${temple.province.toUpperCase()}`;
      }

      // Thông báo chúc phúc
      if (notify && window.Temple3D) {
        const welcomeWrap = document.getElementById('welcomeBannerWrapper');
        if (welcomeWrap) {
          const banner = document.createElement('div');
          banner.className = 'temple-switch-toast';
          banner.innerHTML = `🪷 Chào mừng Thí Chủ viếng <strong>${temple.name}</strong> (${temple.province}) — ${temple.famousFor}`;
          welcomeWrap.appendChild(banner);
          setTimeout(() => banner.remove(), 4200);
        }
      }

      this.hide();
    }

    renderList() {
      const scroll = document.getElementById('templeListScroll');
      if (!scroll) return;

      const filtered = VIETNAM_TEMPLES.filter((t) => {
        const matchesRegion = this.filterRegion === 'All' || t.region === this.filterRegion;
        const matchesSearch = !this.searchTerm || t.name.toLowerCase().includes(this.searchTerm) || t.province.toLowerCase().includes(this.searchTerm) || t.famousFor.toLowerCase().includes(this.searchTerm);
        return matchesRegion && matchesSearch;
      });

      scroll.innerHTML = '';
      filtered.forEach((t) => {
        const item = document.createElement('div');
        item.className = `temple-item-card ${this.activeTemple?.id === t.id ? 'active' : ''}`;
        item.innerHTML = `
          <div class="temple-card-top">
            <span class="temple-item-name">${t.name}</span>
            <span class="temple-item-province">${t.province} (${t.region})</span>
          </div>
          <div class="temple-item-desc">${t.famousFor}</div>
        `;
        item.addEventListener('click', () => this.selectTemple(t));
        scroll.appendChild(item);
      });
    }
  }

  // ===========================================================================
  // 6. SKY LANTERNS SYSTEM (THẢ ĐÈN HOA ĐĂNG 3D BAY LÊN TRỜI CAO)
  // ===========================================================================
  class SkyLanternSystem {
    constructor() {
      this.container = null;
      this.activeLanterns = [];
    }

    init() {
      let box = document.getElementById('lanternContainer');
      if (!box) {
        box = document.createElement('div');
        box.id = 'lanternContainer';
        box.className = 'sky-lantern-container';
        const stage = document.getElementById('stage9x16');
        if (stage) stage.appendChild(box);
      }
      this.container = box;
      console.log('🏮 [SkyLanternSystem] Hệ thống Thả Đèn Hoa Đăng 3D đã sẵn sàng.');
    }

    spawnLantern(donorName, wishText) {
      if (!this.container) return;

      const lantern = document.createElement('div');
      lantern.className = 'floating-sky-lantern';

      const dName = donorName || 'Thí Chủ';
      const dWish = wishText || 'Cầu Quốc Thái Dân An • Gia Đạo Bình An';

      // Random starting X position between 120px and 920px
      const startX = 140 + Math.random() * 800;
      const durationSec = 7.5 + Math.random() * 2.5;
      const swayOffset = (Math.random() - 0.5) * 80;

      lantern.style.left = `${startX}px`;
      lantern.style.setProperty('--sway-x', `${swayOffset}px`);
      lantern.style.animationDuration = `${durationSec}s`;

      lantern.innerHTML = `
        <div class="lantern-glow-halo"></div>
        <div class="lantern-lotus-base">
          <div class="lantern-flame"></div>
          <div class="lantern-paper-body">
            <span class="lantern-symbol">🪷</span>
            <div class="lantern-wish-scroll">${dWish}</div>
            <div class="lantern-donor-tag">${dName}</div>
          </div>
        </div>
      `;

      this.container.appendChild(lantern);

      // Remove after animation finishes
      setTimeout(() => {
        lantern.remove();
      }, durationSec * 1000);
    }
  }

  // Export to window
  window.PagodaChants = PAGODA_CHANTS;
  window.VietnamTemples = VIETNAM_TEMPLES;
  window.generateDharmaName = generateDharmaName;

  window.TempleChant = new ChantEngine();
  window.TempleSelector = new TempleSelectorModal();
  window.SkyLanterns = new SkyLanternSystem();

  // Khởi tạo khi DOM sẵn sàng
  function initAll() {
    window.TempleChant.init();
    window.TempleSelector.init();
    window.SkyLanterns.init();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
