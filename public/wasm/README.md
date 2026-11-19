# 自前配信する WASM をここに配置する。
# 大きい WASM は Worker バンドルに含めず、同一オリジンの静的アセットとして配信する。
# jSquash（画像変換）の WASM はここに置かない。Vite が Worker から読み込まれる WASM を
# build/client/assets/ に出力し、同じオリジンの静的アセットとして配信する（Worker のスクリプトには含まれない）。
