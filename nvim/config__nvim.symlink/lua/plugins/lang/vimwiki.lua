local cmp = require'cmp'
local path = require'path'
local os = require'os'

local vimwiki_source = {
  complete = function(self, request, callback)
    local home_dir = os.getenv("HOME")
    local wiki_dir = path.join(home_dir, 'vimwiki')
    local files = vim.fn.readdir(wiki_dir, function(name)
      return name:match("%.wiki$")
    end)

    local items = {}
    for _, file in ipairs(files) do
      table.insert(items, {
        label = file:gsub("%.wiki$", ""),
        kind = cmp.lsp.CompletionItemKind.File,
        detail = '[Vimwiki]',
      })
    end

    callback({ items = items, isIncomplete = false })
  end,
}

cmp.setup({
  snippet = {
    expand = function(args)
      vim.fn["vsnip#anonymous"](args.body)
    end,
  },
  mapping = {
    ['<C-b>'] = cmp.mapping(cmp.mapping.scroll_docs(-4), { 'i', 'c' }),
    ['<C-f>'] = cmp.mapping(cmp.mapping.scroll_docs(4), { 'i', 'c' }),
    ['<C-Space>'] = cmp.mapping(cmp.mapping.complete(), { 'i', 'c' }),
    ['<C-y>'] = cmp.config.disable, -- Specify `cmp.config.disable` if you want to remove the default `<C-y>` mapping.
    ['<C-e>'] = cmp.mapping({
      i = cmp.mapping.abort(),
      c = cmp.mapping.close(),
    }),
    ['<CR>'] = cmp.mapping.confirm({ select = true }),
  },
  sources = cmp.config.sources({
    { name = 'vimwiki', keyword_length = 2 },
    { name = 'buffer' },
    { name = 'path' },
    { name = 'nvim_lsp' },
    { name = 'nvim_lua' },
    { name = 'vsnip' },
  })
})

-- Register the custom source
cmp.register_source('vimwiki', vimwiki_source)
