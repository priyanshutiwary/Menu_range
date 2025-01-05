<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
  {section.items.map((item) => (
    <MenuItemCard
      key={item.id}
      item={item}
      onEdit={() => {
        setEditingSectionId(section.id)
        handleUpdateMenuItem(section.id, item)
      }}
      onDelete={() => handleDeleteMenuItem(section.id, item.id)}
    />
  ))}
</div>

