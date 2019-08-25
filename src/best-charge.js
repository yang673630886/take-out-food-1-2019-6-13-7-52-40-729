function bestCharge(selectedItems) {
  let dealedItems = dealInput(selectedItems);
  let selectItemInfos = queryItemInfo(dealedItems);
  let promotionInfos = calculateBestCharge(selectItemInfos);
  return printAllInfos(selectItemInfos, promotionInfos);
}


function dealInput(selectedItems) {
  let dealedItems = [];
  for (let i = 0; i < selectedItems.length; i++) {
    dealedItems[i] = {
      id: selectedItems[i].substring(0, 8),
      count: parseInt(selectedItems[i].substring(11))
    }
  }
  return dealedItems;
}


function queryItemInfo(dealedItems) {
  let itemInfos = loadAllItems();
  let selectItemInfos = [];
  for (let i = 0; i < dealedItems.length; i++) {
    for (let j = 0; j < itemInfos.length; j++) {
      if (dealedItems[i].id == itemInfos[j].id) {
        selectItemInfos[i] = {
          id: dealedItems[i].id,
          name: itemInfos[j].name,
          price: itemInfos[j].price,
          count: dealedItems[i].count
        }
      }
    }
  }
  return selectItemInfos;
}

function calculateBestCharge(selectItemInfos) {
  let actualPrice = calculateActualPrice(selectItemInfos);
  let charge1 = calculatePromotion1(selectItemInfos);
  let charge2 = calculatePromotion2(selectItemInfos)
  let promotionInfos1 = {};
  let promotionInfos2 = {};
  if (actualPrice >= 30) {
    promotionInfos1 = {
      name: "满30减6元",
      price: charge1,
      promotion: actualPrice - charge1
    };
    if (ifPromotion2(selectItemInfos) == true) {
      promotionInfos2 = {
        name: "指定菜品半价(黄焖鸡，凉皮)",
        price: charge2,
        promotion: actualPrice - charge2
      }
      if (promotionInfos1.price <= promotionInfos2.price) return promotionInfos1;
      else return promotionInfos2;
    }
    else {
      return promotionInfos1;
    }
  } else {
    if (ifPromotion2(selectItemInfos) == true) {
      promotionInfos2 = {
        name: "指定菜品半价(黄焖鸡，凉皮)",
        price: charge2,
        promotion: actualPrice - charge2
      }
      return promotionInfos2;
    }
    else return "无优惠";
  }
}


function calculateActualPrice(selectItemInfos) {
  let total = 0;
  for (let i = 0; i < selectItemInfos.length; i++) {
    total += (selectItemInfos[i].price * selectItemInfos[i].count)
  }
  return total;
}

function calculatePromotion1(selectItemInfos) {
  let total = 0;
  for (let i = 0; i < selectItemInfos.length; i++) {
    total += (selectItemInfos[i].price * selectItemInfos[i].count)
  }
  if (total >= 30) {
    total = total - 6;
  }
  return total;
}

function ifPromotion2(selectItemInfos) {
  for (let i = 0; i < selectItemInfos.length; i++) {
    let loadPromotion = loadPromotions();
    let promotions = loadPromotion[1].items;
    for (let j = 0; j < promotions.length; j++) {
      if (selectItemInfos[i].id == promotions[j]) {
        return true;
      }
    }
  }
  return false;
}

function calculatePromotion2(selectItemInfos) {
  let total = 0;
  let loadPromotion = loadPromotions();
  let promotions = loadPromotion[1].items;
  for (let i = 0; i < selectItemInfos.length; i++) {
    total += selectItemInfos[i].price * selectItemInfos[i].count
    for (let j = 0; j < promotions.length; j++) {
      if (selectItemInfos[i].id == promotions[j]) {
        total = total - selectItemInfos[i].price * 0.5 * selectItemInfos[i].count
      }
    }
  }
  return total;
}

function printAllInfos(selectItemInfos, promotionInfos) {
  let actualPrice = calculateActualPrice(selectItemInfos);
  if (promotionInfos == "无优惠") {
    let allInfos = "============= 订餐明细 =============\n" +
      printItemInfos(selectItemInfos) +
      "-----------------------------------\n" +
      "总计：" + actualPrice + "元\n" +
      "===================================";
    return allInfos;
  }
  else {
    let allInfos = "============= 订餐明细 =============\n" +
      printItemInfos(selectItemInfos) +
      "-----------------------------------\n" +
      "使用优惠:\n" +
      promotionInfos.name +
      "，省" + promotionInfos.promotion + "元\n" +
      "-----------------------------------\n" +
      "总计：" + promotionInfos.price + "元\n" +
      "===================================";
    return allInfos;
  }
}

function printItemInfos(selectItemInfos) {
  let itemInfos = '';
  for (let i = 0; i < selectItemInfos.length; i++) {
    itemInfos += printLineInfo(selectItemInfos[i])
  }
  return itemInfos;
}

function printLineInfo(selectItemInfo) {
  let itemInfo = '';
  itemInfo = selectItemInfo.name + " x " + selectItemInfo.count + " = "
    + selectItemInfo.price * selectItemInfo.count + "元\n";
  return itemInfo;
}

function loadAllItems() {
  return [{
    id: 'ITEM0001',
    name: '黄焖鸡',
    price: 18.00
  }, {
    id: 'ITEM0013',
    name: '肉夹馍',
    price: 6.00
  }, {
    id: 'ITEM0022',
    name: '凉皮',
    price: 8.00
  }, {
    id: 'ITEM0030',
    name: '冰锋',
    price: 2.00
  }];
}

function loadPromotions() {
  return [{
    type: '满30减6元'
  }, {
    type: '指定菜品半价',
    items: ['ITEM0001', 'ITEM0022']
  }];
}
