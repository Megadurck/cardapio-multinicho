import { useEffect, useMemo, useState } from 'react';

const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const storeWhatsappNumber = (import.meta.env.VITE_STORE_WHATSAPP_NUMBER || '').replace(/\D/g, '') || '5511999999999';

const paymentOptions = [
  { id: 'pix', label: 'Pix' },
  { id: 'dinheiro', label: 'Dinheiro' },
  { id: 'cartao', label: 'Cartão' }
];

const highlights = [
  { title: 'Entrega rápida', text: 'Praticidade para pedir em minutos, sem filas, direto pelo WhatsApp.' },
  { title: 'Cardápio organizado', text: 'Categorias claras e preços visíveis para tomar decisão sem esforço.' },
  { title: 'Pagamento fácil', text: 'Pix, dinheiro ou cartão com mensagem pronta para enviar ao cliente.' }
];

const steps = [
  'Escolha seus itens',
  'Confira o pedido',
  'Envie pelo WhatsApp'
];

function money(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

export default function App() {
  const [menu, setMenu] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [street, setStreet] = useState('');
  const [number, setNumber] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [changeFor, setChangeFor] = useState('');
  const [selectedItems, setSelectedItems] = useState({});
  const [openCategories, setOpenCategories] = useState({});
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const branding = menu?.branding || {
    name: 'Cardápio Online',
    shortName: 'C',
    logoLetter: 'C',
    theme: 'creps',
    eyebrow: 'Cardápio online',
    heroTitle: 'Escolha seus favoritos.',
    heroDescription: 'Monte seu pedido e envie direto para o WhatsApp.',
    popularLabel: 'Destaques',
    orderTitle: 'Monte seu pedido agora',
    highlightTitle: 'Pedidos que fazem sucesso'
  };

  useEffect(() => {
    async function loadMenu() {
      try {
        setIsLoading(true);
        setError('');

        const response = await fetch(`${apiUrl}/api/menu`);

        if (!response.ok) {
          throw new Error('Não foi possível carregar o cardápio.');
        }

        const data = await response.json();
        setMenu(data);
      } catch (err) {
        setError(err.message || 'Erro inesperado ao carregar cardápio.');
      } finally {
        setIsLoading(false);
      }
    }

    loadMenu();
  }, []);

  useEffect(() => {
    document.body.dataset.theme = branding.theme;
  }, [branding.theme]);

  const featuredItems = useMemo(() => {
    if (!menu) return [];

    return menu.categories
      .flatMap((category) => category.items.map((item) => ({ ...item, categoryName: category.name })))
      .slice(0, 3);
  }, [menu]);

  const itemsFlat = useMemo(() => {
    if (!menu) {
      return [];
    }

    return menu.categories.flatMap((category) =>
      category.items.map((item) => ({
        ...item,
        categoryId: category.id,
        categoryName: category.name,
        quantity: selectedItems[item.id] || 0
      }))
    );
  }, [menu, selectedItems]);

  const orderTotal = useMemo(() => {
    return itemsFlat.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [itemsFlat]);

  const totalItems = useMemo(() => {
    return itemsFlat.reduce((sum, item) => sum + item.quantity, 0);
  }, [itemsFlat]);

  function changeQuantity(itemId, nextValue) {
    setSelectedItems((current) => {
      const safeValue = Math.max(0, nextValue);

      if (safeValue === 0) {
        const updated = { ...current };
        delete updated[itemId];
        return updated;
      }

      return {
        ...current,
        [itemId]: safeValue
      };
    });
  }

  function toggleCategory(categoryId) {
    setOpenCategories((current) => ({
      ...current,
      [categoryId]: !current[categoryId]
    }));
  }

  async function handleGeneratePreview(event) {
    event.preventDefault();

    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        customerName,
        address: [street, number, neighborhood].filter(Boolean).join(', '),
        notes,
        paymentMethod,
        changeFor: paymentMethod === 'dinheiro' ? changeFor : '',
        items: itemsFlat
          .filter((item) => item.quantity > 0)
          .map((item) => ({ id: item.id, quantity: item.quantity }))
      };

      const response = await fetch(`${apiUrl}/api/orders/preview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Não foi possível montar o pedido.');
      }

      setPreview(data);
    } catch (err) {
      setPreview(null);
      setError(err.message || 'Erro ao montar a mensagem do pedido.');
    } finally {
      setIsSubmitting(false);
    }
  }

  function openWhatsappWithOrder() {
    if (!preview?.message) {
      return;
    }

    const encoded = encodeURIComponent(preview.message);
    const targetUrl = `https://wa.me/${storeWhatsappNumber}?text=${encoded}`;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  }

  return (
    <main className="min-h-screen bg-transparent">
      <header className="mx-auto max-w-6xl px-4 pb-6 pt-5 md:px-6">
        <div className="flex items-center justify-between rounded-full border border-white/60 bg-white/70 px-4 py-3 shadow-soft backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-orange-400 text-lg font-black text-white shadow-md">
              {branding.logoLetter}
            </div>
            <div>
              <p className="font-display text-sm font-bold uppercase tracking-[0.12em] text-brand-700">{branding.name}</p>
            </div>
          </div>

          <nav className="hidden items-center gap-7 text-sm font-medium text-brand-900/80 md:flex">
            <a href="#inicio" className="transition hover:text-brand-700">Início</a>
            <a href="#cardapio" className="transition hover:text-brand-700">Cardápio</a>
            <a href="#como-funciona" className="transition hover:text-brand-700">Como funciona</a>
            <a href="#pedido" className="transition hover:text-brand-700">Pedido</a>
          </nav>

          <a
            href="#pedido"
            className="rounded-full bg-brand-900 px-4 py-2 text-sm font-bold text-white transition hover:opacity-90"
          >
            Fazer pedido
          </a>
        </div>
      </header>

      <section id="inicio" className="mx-auto max-w-6xl px-4 pb-8 md:px-6">
        <div className="overflow-hidden rounded-[32px] border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-orange-50 shadow-soft">
          <div className="grid gap-8 px-6 py-8 md:grid-cols-[1.1fr_0.9fr] md:px-10 md:py-12">
            <div className="flex flex-col justify-center">
              <span className="mb-4 inline-flex w-fit rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.15em] text-brand-700">
                {branding.eyebrow}
              </span>
              <h1 className="max-w-xl font-display text-4xl font-black leading-tight text-brand-900 md:text-6xl">
                {branding.heroTitle}
              </h1>
              <p className="mt-4 max-w-lg text-lg text-brand-900/75">
                {branding.heroDescription}
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <a
                  href="#cardapio"
                  className="rounded-full bg-gradient-to-r from-brand-500 to-orange-400 px-6 py-3 text-center font-display font-bold text-white shadow-lg shadow-orange-200 transition hover:translate-y-[-1px]"
                >
                  Ver cardápio
                </a>
                <a
                  href="#pedido"
                  className="rounded-full border border-brand-200 bg-white px-6 py-3 text-center font-display font-bold text-brand-900 transition hover:border-brand-300"
                >
                  Fazer pedido
                </a>
              </div>

              <div className="mt-8 flex flex-wrap gap-4 text-sm text-brand-900/75">
                <div className="rounded-full border border-amber-200 bg-white px-3 py-2">
                  <span className="font-display font-bold text-brand-900">15min</span> até receber
                </div>
                <div className="rounded-full border border-amber-200 bg-white px-3 py-2">
                  <span className="font-display font-bold text-brand-900">+500</span> pedidos
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-5 top-8 h-24 w-24 rounded-full bg-orange-200/60 blur-2xl" />
              <div className="absolute -right-5 bottom-8 h-28 w-28 rounded-full bg-amber-200/80 blur-2xl" />

              <div className="relative rounded-[28px] border border-amber-200 bg-white/80 p-5 shadow-soft backdrop-blur-sm">
                <div className="rounded-[22px] bg-gradient-to-br from-brand-900 via-brand-700 to-orange-500 p-5 text-white">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-white/15 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em]">{branding.popularLabel}</span>
                    <span className="text-2xl">✦</span>
                  </div>

                  <div className="mt-6 space-y-4">
                    {featuredItems.length > 0 ? (
                      featuredItems.map((item) => (
                        <div key={item.id} className="rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-sm text-white/75">{item.categoryName}</p>
                              <p className="font-display text-lg font-bold">{item.name}</p>
                            </div>
                            <span className="font-display font-bold">{money(item.price)}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-white/20 bg-white/10 p-3">
                        <p className="font-display text-lg font-bold">Cardápio em destaque</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-6 md:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          {highlights.map((item) => (
            <article key={item.title} className="rounded-3xl border border-amber-200 bg-white/75 p-5 shadow-soft backdrop-blur-sm">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-orange-400 text-lg font-black text-white">
                ✓
              </div>
              <h2 className="font-display text-xl font-bold text-brand-900">{item.title}</h2>
              <p className="mt-2 text-sm leading-6 text-brand-900/75">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="cardapio" className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[0.15em] text-brand-700">Destaques</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-brand-900">{branding.highlightTitle}</h2>
          </div>
          <a href="#pedido" className="hidden text-sm font-bold text-brand-700 md:inline-block">Montar meu pedido →</a>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {featuredItems.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-3xl border border-amber-200 bg-white/80 shadow-soft">
              <div className="h-40 overflow-hidden bg-gradient-to-br from-amber-200 via-orange-100 to-brand-100">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="menu-card-image"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xl font-black uppercase tracking-[0.12em] text-brand-700">
                    {item.name.slice(0, 2)}
                  </div>
                )}
              </div>
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-brand-700">{item.categoryName}</p>
                <h3 className="mt-2 font-display text-xl font-bold text-brand-900">{item.name}</h3>
                <div className="mt-4 flex items-center justify-between">
                  <span className="font-display text-xl font-black text-brand-900">{money(item.price)}</span>
                  <button
                    type="button"
                    className="rounded-full bg-brand-900 px-3 py-2 text-sm font-bold text-white transition hover:opacity-90"
                    onClick={() => changeQuantity(item.id, (selectedItems[item.id] || 0) + 1)}
                  >
                    + Adicionar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="como-funciona" className="mx-auto max-w-6xl px-4 py-8 md:px-6">
        <div className="rounded-[32px] border border-amber-200 bg-brand-900 px-6 py-8 text-white shadow-soft md:px-8">
          <p className="font-display text-xs font-bold uppercase tracking-[0.15em] text-orange-200">Como funciona</p>
          <h2 className="mt-2 font-display text-3xl font-bold">Seu pedido em 3 passos</h2>

          <div className="mt-7 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step} className="rounded-3xl border border-white/10 bg-white/5 p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 font-display text-lg font-bold">
                  {index + 1}
                </div>
                <p className="font-display text-xl font-bold">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {error && <div className="mx-auto mt-6 max-w-6xl rounded-xl border border-red-400 bg-red-100 px-4 py-3 text-red-900">{error}</div>}

      {isLoading && <p className="mx-auto mt-6 max-w-6xl font-display text-sm">Carregando cardápio...</p>}

      {!isLoading && menu && (
        <section id="pedido" className="mx-auto max-w-6xl px-4 py-8 md:px-6">
          <div className="mb-6 text-center">
            <p className="font-display text-xs font-bold uppercase tracking-[0.15em] text-brand-700">Pedido</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-brand-900">{branding.orderTitle}</h2>
          </div>

          <form className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]" onSubmit={handleGeneratePreview}>
            <section className="animate-[fade-in_.8s_ease] rounded-3xl border border-amber-200 bg-amber-50 p-4 shadow-soft md:p-5">
              <div className="mb-3 flex items-baseline justify-between gap-4 border-b border-dashed border-amber-300 pb-3">
                <h3 className="font-display text-2xl">Cardápio</h3>
                <p className="font-display text-sm text-brand-900/70">{totalItems} item(ns) selecionado(s)</p>
              </div>

              <div className="grid gap-3">
                {menu.categories.map((category) => {
                  const isOpen = Boolean(openCategories[category.id]);
                  const categoryTotal = category.items.reduce(
                    (sum, item) => sum + (selectedItems[item.id] || 0),
                    0
                  );

                  return (
                    <article className="overflow-hidden rounded-2xl border border-amber-200 bg-white/70" key={category.id}>
                      <button
                        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-amber-100/70"
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={`category-${category.id}`}
                        onClick={() => toggleCategory(category.id)}
                      >
                        <span>
                          <strong className="font-display text-lg text-brand-700">{category.name}</strong>
                          <span className="mt-1 block text-xs text-brand-900/60">
                            {categoryTotal > 0 ? `${categoryTotal} item(ns) selecionado(s)` : `${category.items.length} opções disponíveis`}
                          </span>
                        </span>
                        <span className={`text-2xl leading-none text-brand-700 transition-transform ${isOpen ? 'rotate-45' : ''}`} aria-hidden="true">
                          +
                        </span>
                      </button>

                      {isOpen && (
                        <div id={`category-${category.id}`} className="grid gap-2 border-t border-amber-200 p-3">
                          {category.items.map((item) => {
                            const qty = selectedItems[item.id] || 0;

                            return (
                              <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50/70 p-3" key={item.id}>
                                <div>
                                  <strong className="font-semibold">{item.name}</strong>
                                  <p className="mt-0.5 text-sm text-brand-900/70">{money(item.price)}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button
                                    className="h-8 w-8 rounded-lg bg-brand-900 text-white transition hover:opacity-85"
                                    type="button"
                                    aria-label={`Remover ${item.name}`}
                                    onClick={() => changeQuantity(item.id, qty - 1)}
                                  >
                                    -
                                  </button>
                                  <span className="min-w-8 text-center font-display text-sm">{qty}</span>
                                  <button
                                    className="h-8 w-8 rounded-lg bg-brand-900 text-white transition hover:opacity-85"
                                    type="button"
                                    aria-label={`Adicionar ${item.name}`}
                                    onClick={() => changeQuantity(item.id, qty + 1)}
                                  >
                                    +
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="animate-[fade-in_.9s_ease] rounded-3xl border border-amber-200 bg-amber-50 p-4 shadow-soft md:p-5">
              <div className="mb-5 flex flex-col gap-4 border-b border-dashed border-amber-300 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="font-display text-2xl">Finalização</h3>
                  <p className="mt-1 text-sm text-brand-900/65">Confira os dados antes de enviar</p>
                </div>
                <div className="rounded-xl bg-brand-900 px-3 py-2 text-white shadow-md shadow-brand-900/15 sm:min-w-32 sm:text-right">
                  <span className="block text-xs font-bold uppercase tracking-[0.12em] text-orange-200">Total parcial</span>
                  <strong className="mt-1 block font-display text-lg font-black leading-none">{money(orderTotal)}</strong>
                  <span className="mt-1 block text-[11px] text-white/65">{totalItems} item(ns) no pedido</span>
                </div>
              </div>

              <label className="mb-3 grid gap-2 font-display text-sm">
                Nome do cliente
                <input
                  className="rounded-xl border border-amber-200 bg-white px-3 py-2 font-body text-base"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  placeholder="Ex: Maria"
                />
              </label>

              <div className="mb-3 grid gap-3">
                <label className="grid gap-2 font-display text-sm">
                  Rua
                  <input
                    className="rounded-xl border border-amber-200 bg-white px-3 py-2 font-body text-base"
                    value={street}
                    onChange={(event) => setStreet(event.target.value)}
                    placeholder="Ex: Rua das Flores"
                  />
                </label>
                <label className="grid gap-2 font-display text-sm">
                  Nº
                  <input
                    className="rounded-xl border border-amber-200 bg-white px-3 py-2 font-body text-base"
                    value={number}
                    onChange={(event) => setNumber(event.target.value)}
                    placeholder="Ex: 123"
                  />
                </label>
                <label className="grid gap-2 font-display text-sm">
                  Bairro
                  <input
                    className="rounded-xl border border-amber-200 bg-white px-3 py-2 font-body text-base"
                    value={neighborhood}
                    onChange={(event) => setNeighborhood(event.target.value)}
                    placeholder="Ex: Centro"
                  />
                </label>
              </div>

              <label className="mb-3 grid gap-2 font-display text-sm">
                Forma de pagamento
                <div className="flex gap-2">
                  {paymentOptions.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={`rounded-xl border px-3 py-2 font-display text-sm transition ${
                        paymentMethod === option.id
                          ? 'border-brand-500 bg-brand-500 text-white'
                          : 'border-amber-200 bg-white text-brand-900 hover:border-brand-300'
                      }`}
                      onClick={() => setPaymentMethod(option.id)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </label>

              {paymentMethod === 'dinheiro' && (
                <div className="mb-3">
                  <label className="grid gap-2 font-display text-sm">
                    Troco para quanto
                    <input
                      className="rounded-xl border border-amber-200 bg-white px-3 py-2 font-body text-base"
                      value={changeFor}
                      onChange={(event) => setChangeFor(event.target.value)}
                      placeholder="Ex: 50,00"
                      required
                    />
                  </label>
                  {changeFor && (() => {
                    const changeValue = parseFloat(changeFor.replace(',', '.')) || 0;
                    const change = changeValue - orderTotal;
                    return change >= 0 ? (
                      <p className="mt-2 rounded-lg bg-green-50 px-3 py-2 text-sm font-display text-green-800">
                        Troco: <strong>{money(change)}</strong>
                      </p>
                    ) : (
                      <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-display text-red-800">
                        Falta: <strong>{money(Math.abs(change))}</strong>
                      </p>
                    );
                  })()}
                </div>
              )}

              <label className="mb-3 grid gap-2 font-display text-sm">
                Observações
                <textarea
                  className="rounded-xl border border-amber-200 bg-white px-3 py-2 font-body text-base"
                  rows={4}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder="Sem cebola, retirar gelo, etc"
                />
              </label>

              <button
                className="w-full rounded-xl bg-gradient-to-r from-brand-500 to-orange-400 px-4 py-3 font-display font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Montando pedido...' : 'Gerar mensagem do pedido'}
              </button>

              {preview && (
                <div className="mt-4 border-t border-dashed border-amber-300 pt-4">
                  <h3 className="font-display text-lg">Mensagem pronta</h3>
                  <p className="mb-2 text-sm text-brand-900/80">Total final: {preview.formattedTotal}</p>
                  <textarea
                    className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 font-body text-sm"
                    readOnly
                    value={preview.message}
                    rows={10}
                  />
                  <button
                    type="button"
                    className="mt-3 w-full rounded-xl bg-gradient-to-r from-mint-500 to-emerald-500 px-4 py-3 font-display font-bold text-white transition hover:opacity-90"
                    onClick={openWhatsappWithOrder}
                  >
                    Enviar no WhatsApp
                  </button>
                </div>
              )}
            </section>
          </form>
        </section>
      )}
    </main>
  );
}
