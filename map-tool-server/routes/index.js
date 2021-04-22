const router = require('koa-router')()
const fs = require('fs');
const path = require('path');
const send = require('koa-send');

router.prefix('/api')

router.post('/uploadFile', async (ctx, next) => {
  // 上传单个文件
  const file = ctx.request.files.file; // 获取上传文件
  // 创建可读流
  const reader = fs.createReadStream(file.path);
  const filePath = path.join(__dirname, `../public/upload/${file.name}`);
  // 创建可写流
  const upStream = fs.createWriteStream(filePath);
  // 可读流通过管道写入可写流
  reader.pipe(upStream);
  const content = await new Promise((resolve, reject) => {
    try {
      reader.on('end', () => {
        const content = fs.readFileSync(filePath);
        resolve(content.toString());
      })
    } catch (error) {
      reject(error);
    }
  });
  return ctx.body = {
    status: 200,
    msg: "上传成功！",
    data: JSON.parse(content)
  };
});

router.post('/writeFile', async (ctx, next) => {
  // 导出文件
  const filePath = path.join(__dirname, '../public/download/list.json');
  // 调整格式，写入文件
  await fs.writeFileSync(filePath, JSON.stringify(ctx.request.body, "", "\t"));
  return ctx.body = {
    status: 200,
    msg: "写入成功！"
  };
});

router.get('/exportFile', async (ctx, next) => {
  // 导出文件
  ctx.attachment('list.json');
  await send(ctx, 'public/download/list.json' );
});



module.exports = router
