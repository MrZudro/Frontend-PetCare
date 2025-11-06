import React, { useEffect, useState } from 'react';

export default function HistorialPeXh() {
  
  return (
    <div className="min-h-screen p-6 bg-lightbg dark:bg-darkbg text-gray-900 dark:text-white transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-primary dark:text-accent">Historial de Pedidos</h2>
          <div className="flex items-center gap-3">
            <select value={mes} onChange={(e) => setMes(e.target.value)}
              className="p-3 rounded-xl bg-white dark:bg-[#0f1724] border border-softgray dark:border-gray-700 shadow-sm">
              <option value=''>Todos los meses</option>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i+1} value={i+1}>
                  {new Date(0, i).toLocaleString('es', { month: 'long', year: 'numeric' })}
                </option>
              ))}
            </select>

            <button onClick={obtenerPedidos} className="px-4 py-2 rounded-lg bg-accent text-white hover:opacity-95">Filtrar</button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Cargando...</div>
        ) : pedidos.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No hay pedidos en este periodo.</div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {pedidos.map((p) => (
              <article key={p.id} className="bg-white dark:bg-[#0b1220] rounded-2xl p-5 shadow-lg border border-softgray dark:border-gray-700 hover:shadow-xl transition transform hover:-translate-y-1">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-200">Pedido #{p.id}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Fecha: {p.fechaEntrega || p.fecha || '—'}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${p.estado === 'Entregado' ? 'bg-[#00C8C8]/20 text-[#00C8C8]' : 'bg-primary/20 text-primary'}`}>
                    {p.estado}
                  </span>
                </div>

                <div className="space-y-2">
                  {(p.productos || []).slice(0,2).map((prod, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center">
                          {prod.imagen ? <img src={prod.imagen} alt={prod.nombre} className="w-full h-full object-cover rounded-md" /> : <span className="text-gray-400">🛍️</span>}
                        </div>
                        <div>
                          <p className="text-gray-700 dark:text-gray-200">{prod.nombre}</p>
                          <p className="text-xs text-gray-500">{prod.cantidad || 1} × ${fmt(prod.precio)}</p>
                        </div>
                      </div>
                      <div className="text-sm font-semibold">${fmt(prod.precio)}</div>
                    </div>
                  ))}
                  { (p.productos || []).length > 2 && <p className="text-xs text-gray-400">{(p.productos || []).length - 2} productos más...</p>}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <div className="text-lg font-bold text-primary dark:text-accent">Total: ${fmt(p.total)}</div>
                    <div className="text-xs text-gray-500">{p.direccion || ''}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <button onClick={() => setDetalle(p)} className="px-3 py-1 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-700">Ver detalle</button>
                    <button className="px-3 py-1 rounded-lg bg-primary text-white text-sm hover:opacity-95">Comprar de nuevo</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {detalle && (
          <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-[#0b1220] rounded-2xl shadow-xl w-full max-w-2xl p-6">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-bold text-primary dark:text-accent">Detalle Pedido #{detalle.id}</h3>
                <button onClick={() => setDetalle(null)} className="text-gray-600 dark:text-gray-300">✕</button>
              </div>

              <div className="mt-4 space-y-3">
                {(detalle.productos || []).map((prod, i) => (
                  <div key={i} className="flex justify-between items-center bg-gray-50 dark:bg-[#071025] p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center">
                        {prod.imagen ? <img src={prod.imagen} alt={prod.nombre} className="w-full h-full object-cover rounded-md" /> : <span className="text-gray-400">🛍️</span>}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-200">{prod.nombre}</p>
                        <p className="text-sm text-gray-500">{prod.descripcion || ''}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${fmt(prod.precio)}</p>
                      <p className="text-sm text-gray-500">{prod.cantidad || 1} unidad(es)</p>
                    </div>
                  </div>
                ))}

                <div className="mt-4 border-t border-softgray dark:border-gray-700 pt-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Dirección</p>
                    <p className="font-medium">{detalle.direccion}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Fecha Entrega</p>
                    <p className="font-medium">{detalle.fechaEntrega || detalle.fecha}</p>
                    <p className="text-lg font-bold text-primary dark:text-accent mt-2">Total: ${fmt(detalle.total)}</p>
                  </div>
                </div>

                <div className="mt-4 text-right">
                  <button onClick={() => setDetalle(null)} className="px-4 py-2 rounded-lg bg-accent text-white">Cerrar</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
