import { Layout, Form, message, Pagination } from 'antd';
import { useEffect, useState } from 'react';

import { ToolsManagerHeader } from '../../../modules/tools/components/ToolsManagerHeader';
import { ToolCard } from '../../../modules/tools/components/ToolCard';
import { ToolForm } from '../../../modules/tools/components/ToolForm';

import { useToolsManager } from '../../../modules/tools/hooks/useToolsManager';

const { Content } = Layout;

const PAGE_SIZE = 12;

export function ToolsManager() {
  /* =========================
     HOOK
  ========================== */
  const {
    tools,
    loading,
    page,
    totalPages,
    fetchTools,

    // filtros
    name,
    category,
    status,
    setName,
    setCategory,
    setStatus,

    // feedback
    success,
    error,
    setSuccess,
    setError,

    // ações
    createTool,
    updateTool,
    deleteTool,
  } = useToolsManager();

  /* =========================
     MODAL
  ========================== */
  const [open, setOpen] = useState(false);
  const [editingTool, setEditingTool] = useState(null);

  const [form] = Form.useForm();

  const openCreateModal = () => {
    setEditingTool(null);
    form.resetFields();
    setOpen(true);
  };

  const openEditModal = (tool) => {
    setEditingTool(tool);
    form.setFieldsValue(tool);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setEditingTool(null);
  };

  /* =========================
     FEEDBACK UI
  ========================== */
  useEffect(() => {
    if (success) {
      message.success(success);
      setSuccess(null);
      closeModal();
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      message.error(error);
      setError(null);
    }
  }, [error]);

  /* =========================
     SUBMIT
  ========================== */
  const handleSubmit = async (values) => {
    if (editingTool) {
      return await updateTool(editingTool.id, values);
    }
    return await createTool(values);
  };

  /* =========================
     PAGINAÇÃO
  ========================== */
  const handlePageChange = (pageNumber) => {
    // AntD começa em 1, backend em 0
    fetchTools(pageNumber - 1);
  };

  console.log(tools);
  /* =========================
     RENDER
  ========================== */
  return (
    <Layout>
      {/* HEADER */}
      <ToolsManagerHeader
        title='Ferramentas'
        description='Gerencie o catálogo de ferramentas'
        btnText='Cadastrar ferramenta'
        inputPlaceholder='Buscar por nome...'
        onAddClick={openCreateModal}
        searchValue={name}
        onSearchChange={setName}
        categoryFilter={category}
        onCategoryChange={setCategory}
        statusFilter={status}
        onStatusChange={setStatus}
      />

      {/* GRID */}
      <Content style={{ padding: 24 }}>
        <ToolCard tools={tools} loading={loading} onEdit={openEditModal} onDelete={deleteTool} />

        {/* PAGINAÇÃO */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
            <Pagination
              current={page + 1}
              total={totalPages * PAGE_SIZE}
              pageSize={PAGE_SIZE}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        )}
      </Content>

      {/* MODAL */}
      <ToolForm
        open={open}
        form={form}
        onClose={closeModal}
        onSubmit={handleSubmit}
        editingTool={editingTool}
      />
    </Layout>
  );
}

export default ToolsManager;
