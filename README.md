## 安装 rust

```shell
curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
```

## 安装 nodejs

```shell
node -v
# v20.10.0

npm -v
# 10.2.3
```

## 开发

```shell
npm run tauri dev
```

## 打包

```shell
npm run tauri build -- --bundles dmg
```