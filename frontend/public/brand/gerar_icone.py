from PIL import Image, ImageDraw, ImageFilter

# ---------- Cores da identidade visual do projeto (mesmas da landing page) ----------
TEAL_BG      = (15, 92, 79, 255)     # #0F5C4F - fundo do ícone
TEAL_DARK    = (10, 61, 52, 255)     # #0A3D34 - detalhe escuro (a cruz)
TEAL_GLOW    = (27, 122, 104, 255)   # tom mais claro, para o brilho suave atrás do pino
WHITE        = (255, 255, 255, 255)

SIZE = 1024  # desenhamos grande (mestre) e depois reduzimos com qualidade

def rounded_square(size, radius, color):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=color)
    return img

def draw_pin(draw, cx, cy, r, color):
    # Círculo (cabeça do pino)
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=color)
    # Ponta do pino (triângulo que se funde com o círculo)
    tip_y = cy + r * 2.5
    draw.polygon(
        [
            (cx - r * 0.85, cy + r * 0.45),
            (cx + r * 0.85, cy + r * 0.45),
            (cx, tip_y),
        ],
        fill=color,
    )

def draw_cross(draw, cx, cy, arm_len, arm_thick, color):
    # Barra vertical
    draw.rounded_rectangle(
        [cx - arm_thick / 2, cy - arm_len / 2, cx + arm_thick / 2, cy + arm_len / 2],
        radius=arm_thick / 2,
        fill=color,
    )
    # Barra horizontal
    draw.rounded_rectangle(
        [cx - arm_len / 2, cy - arm_thick / 2, cx + arm_len / 2, cy + arm_thick / 2],
        radius=arm_thick / 2,
        fill=color,
    )

# 1) Fundo: quadrado arredondado (padrão de ícone de app moderno)
icon = rounded_square(SIZE, radius=int(SIZE * 0.22), color=TEAL_BG)

# 2) Brilho suave atrás do pino, pra dar profundidade
glow = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
glow_draw = ImageDraw.Draw(glow)
gcx, gcy = SIZE * 0.5, SIZE * 0.42
glow_draw.ellipse([gcx - 230, gcy - 230, gcx + 230, gcy + 230], fill=TEAL_GLOW)
glow = glow.filter(ImageFilter.GaussianBlur(60))
icon = Image.alpha_composite(icon, glow)

# 3) O pino branco
draw = ImageDraw.Draw(icon)
pin_cx, pin_cy, pin_r = SIZE * 0.5, SIZE * 0.40, SIZE * 0.165
draw_pin(draw, pin_cx, pin_cy, pin_r, WHITE)

# 4) A cruz de saúde, dentro da cabeça do pino
draw_cross(draw, pin_cx, pin_cy, arm_len=pin_r * 1.05, arm_thick=pin_r * 0.36, color=TEAL_DARK)

# ---------- Salva o arquivo mestre em alta resolução ----------
icon.save("/home/claude/logo-master.png")

# ---------- Gera as duas versões que o manifest do PWA exige ----------
icon.resize((512, 512), Image.LANCZOS).save("/home/claude/icon-512.png")
icon.resize((192, 192), Image.LANCZOS).save("/home/claude/icon-192.png")

print("Ícones gerados com sucesso.")
